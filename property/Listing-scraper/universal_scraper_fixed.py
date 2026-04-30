"""
Universal Scraper Windows - Fixed Version
Fixed network issues and dependency conflicts
"""

import uuid
import json
import os
import time
import random
import re
from datetime import datetime
from urllib.parse import urlparse

try:
    from playwright.sync_api import sync_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

try:
    import requests
    from bs4 import BeautifulSoup
    BACKUP_AVAILABLE = True
except ImportError:
    BACKUP_AVAILABLE = False

class FixedUniversalScraper:
    def __init__(self):
        self.results = []
        
    def detect_platform(self, url: str) -> str:
        """Auto-detect platform from URL"""
        domain = urlparse(url).netloc.lower()
        
        platform_patterns = {
            'zillow': ['zillow.com'],
            'realtor': ['realtor.com'],
            'redfin': ['redfin.com'],
            'amazon': ['amazon.com', 'amazon.co.uk', 'amazon.de'],
            'ebay': ['ebay.com', 'ebay.co.uk'],
            'cars': ['cars.com', 'autotrader.com', 'cargurus.com'],
            'craigslist': ['craigslist.org'],
            'facebook': ['facebook.com/marketplace'],
            'bestbuy': ['bestbuy.com'],
            'walmart': ['walmart.com'],
            'newegg': ['newegg.com']
        }
        
        for platform, domains in platform_patterns.items():
            if any(d in domain for d in domains):
                return platform
        
        return 'generic'
    
    def create_output_folder(self, platform: str, url: str) -> str:
        """Create output folder with unique ID"""
        unique_id = str(uuid.uuid4())[:8]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        folder_name = f"{platform}_{unique_id}_{timestamp}"
        output_folder = os.path.join("scraped_data", folder_name)
        os.makedirs(output_folder, exist_ok=True)
        
        # Create photos subfolder
        photos_folder = os.path.join(output_folder, "photos")
        os.makedirs(photos_folder, exist_ok=True)
        
        return output_folder
    
    def extract_with_playwright(self, url: str, platform: str) -> dict:
        """Extract data using Playwright with network fixes"""
        if not PLAYWRIGHT_AVAILABLE:
            return None
        
        try:
            with sync_playwright() as p:
                print(f"🌐 Launching browser for {platform}...")
                
                # Launch browser with network fixes
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        '--no-sandbox',
                        '--disable-blink-features=AutomationControlled',
                        '--disable-dev-shm-usage',
                        '--disable-web-security',
                        '--disable-features=VizDisplayCompositor',
                        '--ignore-certificate-errors',
                        '--ignore-ssl-errors',
                        '--ignore-certificate-errors-spki-list'
                    ]
                )
                
                # Create context with anti-detection
                context = browser.new_context(
                    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    viewport={'width': 1920, 'height': 1080},
                    locale='en-US',
                    ignore_https_errors=True,
                    accept_downloads=True
                )
                
                page = context.new_page()
                
                # Set additional anti-detection
                page.add_init_script("""
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => undefined,
                    });
                    Object.defineProperty(navigator, 'plugins', {
                        get: () => [1, 2, 3, 4, 5],
                    });
                """)
                
                print(f"📡 Navigating to: {url}")
                
                # Try multiple navigation strategies
                try:
                    page.goto(url, wait_until="networkidle", timeout=60000)
                except Exception as e:
                    print(f"⚠️ Network error, trying alternative method: {e}")
                    try:
                        page.goto(url, wait_until="domcontentloaded", timeout=60000)
                    except Exception as e2:
                        print(f"❌ Navigation failed completely: {e2}")
                        return None
                
                # Wait for content to load
                time.sleep(random.uniform(3, 6))
                
                # Try to scroll for lazy-loaded content
                try:
                    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    time.sleep(2)
                except:
                    pass
                
                # Extract data
                data = self.extract_data_by_platform(page, platform, url)
                
                # Extract images
                images = self.extract_images_by_platform(page, platform, url)
                
                # Download images
                output_folder = data['output_folder']
                photos_folder = os.path.join(output_folder, "photos")
                downloaded_images = self.download_images(page, images, photos_folder)
                
                data['media']['images'] = downloaded_images
                data['media']['total_images'] = len(downloaded_images)
                
                browser.close()
                return data
                
        except Exception as e:
            print(f"❌ Playwright extraction failed: {e}")
            return None
    
    def extract_data_by_platform(self, page, platform: str, url: str) -> dict:
        """Extract data based on platform-specific logic"""
        output_folder = self.create_output_folder(platform, url)
        
        base_data = {
            'platform': platform,
            'url': url,
            'scraping_metadata': {
                'timestamp': datetime.now().isoformat(),
                'method': 'browser_automation',
                'success_rate': 0,
                'duration_seconds': 0
            },
            'item_data': {
                'title': None,
                'price': None,
                'description': None,
                'specifications': {},
                'location': {},
                'seller': {}
            },
            'media': {
                'total_images': 0,
                'images': []
            },
            'platform_specific': {},
            'output_folder': output_folder
        }
        
        start_time = time.time()
        
        try:
            if platform == 'cars':
                base_data.update(self.extract_cars_data(page))
            elif platform == 'zillow':
                base_data.update(self.extract_zillow_data(page))
            elif platform == 'amazon':
                base_data.update(self.extract_amazon_data(page))
            elif platform == 'ebay':
                base_data.update(self.extract_ebay_data(page))
            elif platform == 'craigslist':
                base_data.update(self.extract_craigslist_data(page))
            else:
                base_data.update(self.extract_generic_data(page))
            
            base_data['scraping_metadata']['duration_seconds'] = time.time() - start_time
            base_data['scraping_metadata']['success_rate'] = 100
            
        except Exception as e:
            print(f"❌ Data extraction error: {e}")
            base_data['scraping_metadata']['success_rate'] = 0
        
        return base_data
    
    def extract_cars_data(self, page) -> dict:
        """Extract Cars.com-specific data"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            # Extract title
            title_selectors = [
                'h1[class*="heading"]',
                'h1',
                '.title',
                '[data-test="vehicleTitle"]'
            ]
            
            for selector in title_selectors:
                element = page.query_selector(selector)
                if element:
                    text = element.text_content()
                    if text and len(text.strip()) > 5:
                        data['item_data']['title'] = text.strip()
                        break
            
            # Extract price
            price_selectors = [
                '[data-test="vehiclePrice"]',
                '.price',
                '.primary-price',
                '[class*="price"]'
            ]
            
            for selector in price_selectors:
                elements = page.query_selector_all(selector)
                for element in elements:
                    text = element.text_content()
                    if text and '$' in text:
                        data['item_data']['price'] = text.strip()
                        break
                if data['item_data'].get('price'):
                    break
            
            # Extract specifications
            spec_patterns = [
                ('year', '[data-test="vehicleYear"]'),
                ('make', '[data-test="vehicleMake"]'),
                ('model', '[data-test="vehicleModel"]'),
                ('mileage', '[data-test="vehicleMileage"]'),
                ('transmission', '[data-test="vehicleTransmission"]'),
                ('engine', '[data-test="vehicleEngine"]'),
                ('drivetrain', '[data-test="vehicleDrivetrain"]'),
                ('fuel_type', '[data-test="vehicleFuelType"]'),
                ('exterior_color', '[data-test="vehicleExteriorColor"]'),
                ('interior_color', '[data-test="vehicleInteriorColor"]'),
                ('vin', '[data-test="vehicleVin"]'),
                ('stock_number', '[data-test="vehicleStockNumber"]')
            ]
            
            for spec_name, selector in spec_patterns:
                element = page.query_selector(selector)
                if element:
                    text = element.text_content()
                    if text and text.strip():
                        data['item_data']['specifications'][spec_name] = text.strip()
            
            # Extract description
            desc_selectors = [
                '[data-test="vehicleDescription"]',
                '.description',
                '.vehicle-description',
                '[class*="description"]'
            ]
            
            for selector in desc_selectors:
                element = page.query_selector(selector)
                if element:
                    text = element.text_content()
                    if text and len(text.strip()) > 20:
                        data['item_data']['description'] = text.strip()
                        break
            
            # Extract location
            location_selectors = [
                '[data-test="vehicleLocation"]',
                '.location',
                '[class*="location"]'
            ]
            
            for selector in location_selectors:
                element = page.query_selector(selector)
                if element:
                    text = element.text_content()
                    if text and text.strip():
                        data['item_data']['location']['raw'] = text.strip()
                        break
            
            # Extract seller info
            seller_selectors = [
                '[data-test="sellerName"]',
                '.seller-name',
                '[class*="seller"]'
            ]
            
            for selector in seller_selectors:
                element = page.query_selector(selector)
                if element:
                    text = element.text_content()
                    if text and text.strip():
                        data['item_data']['seller']['name'] = text.strip()
                        break
            
            # Extract Cars.com specific data
            url = page.url
            # Extract vehicle ID from URL
            id_match = re.search(r'vehicledetail/([^/]+)', url)
            if id_match:
                data['platform_specific']['vehicle_id'] = id_match.group(1)
            
            # Try to get VIN from page
            vin_element = page.query_selector('[data-test="vehicleVin"]')
            if vin_element:
                vin_text = vin_element.text_content()
                if vin_text:
                    data['platform_specific']['vin'] = vin_text.strip()
            
        except Exception as e:
            print(f"❌ Cars.com extraction error: {e}")
        
        return data
    
    def extract_zillow_data(self, page) -> dict:
        """Extract Zillow-specific data"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            # Extract title/address
            title_element = page.query_selector('h1')
            if title_element:
                data['item_data']['title'] = title_element.text_content().strip()
            
            # Extract price
            price_elements = page.query_selector_all('span')
            for element in price_elements:
                text = element.text_content()
                if text and '$' in text and ',' in text and len(text) > 6:
                    price_match = re.search(r'\$[\d,]+', text)
                    if price_match and int(re.sub(r'[^0-9]', '', text)) > 10000:
                        data['item_data']['price'] = price_match.group(0)
                        break
            
            # Extract beds, baths, sqft
            spans = page.query_selector_all('span')
            for span in spans:
                text = span.text_content()
                if text and re.match(r'^\d+\s*beds?$', text, re.IGNORECASE):
                    data['item_data']['specifications']['beds'] = text
                elif text and re.match(r'^\d+\s*baths?$', text, re.IGNORECASE):
                    data['item_data']['specifications']['baths'] = text
                elif text and re.match(r'^\d[\d,]*\s*sqft$', text, re.IGNORECASE):
                    data['item_data']['specifications']['sqft'] = text
            
            # Extract description
            articles = page.query_selector_all('article')
            for article in articles:
                text = article.text_content()
                if text and len(text) > 100 and 'days' not in text:
                    data['item_data']['description'] = text.strip()
                    break
            
            # Extract Zillow-specific data
            url = page.url
            zpid_match = re.search(r'(\d+)_zpid', url)
            if zpid_match:
                data['platform_specific']['zpid'] = zpid_match.group(1)
            
            title = page.title()
            mls_match = re.search(r'MLS[_%20]+(\d+)', title, re.IGNORECASE)
            if mls_match:
                data['platform_specific']['mls_id'] = mls_match.group(1)
            
        except Exception as e:
            print(f"❌ Zillow extraction error: {e}")
        
        return data
    
    def extract_amazon_data(self, page) -> dict:
        """Extract Amazon-specific data"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            # Extract title
            title_element = page.query_selector('#productTitle')
            if title_element:
                data['item_data']['title'] = title_element.text_content().strip()
            
            # Extract price
            price_elements = page.query_selector_all('.a-price-whole')
            for element in price_elements:
                text = element.text_content()
                if text and text.replace('$', '').replace(',', '').replace('.', '').isdigit():
                    data['item_data']['price'] = f"${text.strip()}"
                    break
            
            # Extract description
            desc_element = page.query_selector('#feature-bullets')
            if desc_element:
                data['item_data']['description'] = desc_element.text_content().strip()
            
            # Extract Amazon-specific data
            asin_element = page.query_selector('[data-asin]')
            if asin_element:
                data['platform_specific']['asin'] = asin_element.get_attribute('data-asin')
            
        except Exception as e:
            print(f"❌ Amazon extraction error: {e}")
        
        return data
    
    def extract_ebay_data(self, page) -> dict:
        """Extract eBay-specific data"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            # Extract title
            title_element = page.query_selector('h1')
            if title_element:
                data['item_data']['title'] = title_element.text_content().strip()
            
            # Extract price
            price_elements = page.query_selector_all('.u-flL.condText')
            for element in price_elements:
                text = element.text_content()
                if text and '$' in text:
                    data['item_data']['price'] = text.strip()
                    break
            
            # Extract eBay-specific data
            item_id_match = re.search(r'/itm/(\d+)', page.url)
            if item_id_match:
                data['platform_specific']['item_id'] = item_id_match.group(1)
            
        except Exception as e:
            print(f"❌ eBay extraction error: {e}")
        
        return data
    
    def extract_craigslist_data(self, page) -> dict:
        """Extract Craigslist-specific data"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            # Extract title
            title_element = page.query_selector('#titletextonly')
            if title_element:
                data['item_data']['title'] = title_element.get_attribute('value') or title_element.text_content().strip()
            
            # Extract price
            price_element = page.query_selector('.price')
            if price_element:
                data['item_data']['price'] = price_element.text_content().strip()
            
            # Extract description
            desc_element = page.query_selector('#postingbody')
            if desc_element:
                data['item_data']['description'] = desc_element.text_content().strip()
            
        except Exception as e:
            print(f"❌ Craigslist extraction error: {e}")
        
        return data
    
    def extract_generic_data(self, page) -> dict:
        """Extract data from generic websites"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            # Try common title selectors
            title_selectors = ['h1', 'title', '.title', '#title', '[data-title]']
            for selector in title_selectors:
                element = page.query_selector(selector)
                if element:
                    text = element.text_content().strip()
                    if text and len(text) > 5:
                        data['item_data']['title'] = text
                        break
            
            # Try common price selectors
            price_selectors = ['.price', '#price', '[data-price]', '.cost', '.amount']
            for selector in price_selectors:
                elements = page.query_selector_all(selector)
                for element in elements:
                    text = element.text_content()
                    if text and ('$' in text or '£' in text or '€' in text):
                        data['item_data']['price'] = text.strip()
                        break
                if data['item_data'].get('price'):
                    break
            
            # Try common description selectors
            desc_selectors = ['.description', '#description', '.details', '.summary', '[data-description]']
            for selector in desc_selectors:
                element = page.query_selector(selector)
                if element:
                    text = element.text_content().strip()
                    if text and len(text) > 50:
                        data['item_data']['description'] = text
                        break
            
        except Exception as e:
            print(f"❌ Generic extraction error: {e}")
        
        return data
    
    def extract_images_by_platform(self, page, platform: str, url: str) -> list:
        """Extract images based on platform"""
        images = []
        
        try:
            if platform == 'cars':
                # Cars.com specific image extraction
                img_elements = page.query_selector_all('img[src*="photos.cars.com"], img[src*="static"], img[alt*="photo"]')
                for i, img in enumerate(img_elements):
                    src = img.get_attribute('src')
                    if src and src.startswith('http') and len(src) > 20:
                        images.append({
                            'url': src,
                            'filename': f'image_{i+1:02d}.jpg',
                            'platform': 'cars'
                        })
            
            elif platform == 'zillow':
                # Zillow-specific image extraction
                photo_urls = page.evaluate("""
                    () => {
                        const urls = [];
                        const scripts = document.querySelectorAll('script');
                        
                        for (const script of scripts) {
                            const content = script.textContent;
                            const urlMatches = content.match(/https:\\/\\/photos\\.zillowstatic\\.com\\/fp\\/[^"\\s]+/g);
                            if (urlMatches) {
                                urls.push(...urlMatches);
                            }
                        }
                        return [...new Set(urls)];
                    }
                """)
                
                for i, url in enumerate(photo_urls):
                    images.append({
                        'url': url,
                        'filename': f'image_{i+1:02d}.webp',
                        'platform': 'zillow'
                    })
            
            else:
                # Generic image extraction
                img_elements = page.query_selector_all('img')
                for i, img in enumerate(img_elements):
                    src = img.get_attribute('src')
                    if src and src.startswith('http') and not 'icon' in src.lower() and len(src) > 20:
                        images.append({
                            'url': src,
                            'filename': f'image_{i+1:02d}.jpg',
                            'platform': 'generic'
                        })
        
        except Exception as e:
            print(f"❌ Image extraction error: {e}")
        
        return images[:20]  # Limit to 20 images
    
    def download_images(self, page, images: list, output_folder: str) -> list:
        """Download images using browser context"""
        downloaded = []
        
        for i, image_info in enumerate(images):
            try:
                # Rate limiting
                time.sleep(random.uniform(0.5, 1.5))
                
                print(f"⬇️  Downloading image {i+1}: {image_info['url'][:50]}...")
                
                # Go to image URL
                response = page.goto(image_info['url'], timeout=30000)
                
                if response and response.ok:
                    # Determine file extension
                    parsed_url = urlparse(image_info['url'])
                    ext = os.path.splitext(parsed_url.path)[1] or '.jpg'
                    if ext == '.webp':
                        ext = '.webp'
                    elif ext == '.png':
                        ext = '.png'
                    else:
                        ext = '.jpg'
                    
                    filename = f"image_{i+1:02d}{ext}"
                    filepath = os.path.join(output_folder, filename)
                    
                    # Save image
                    with open(filepath, 'wb') as f:
                        f.write(response.body())
                    
                    downloaded.append({
                        'filename': filename,
                        'url': image_info['url'],
                        'filepath': filepath,
                        'size_bytes': len(response.body())
                    })
                    
                    print(f"✅ Downloaded image: {filename}")
                
            except Exception as e:
                print(f"❌ Failed to download image {i+1}: {e}")
        
        return downloaded
    
    def save_results(self, data: dict, output_folder: str) -> str:
        """Save results to JSON file"""
        json_file = os.path.join(output_folder, "property_data.json")
        
        try:
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"📄 Data saved to: {json_file}")
            return json_file
            
        except Exception as e:
            print(f"❌ Failed to save data: {e}")
            return None
    
    def scrape_url(self, url: str) -> dict:
        """Main scraping function - single URL"""
        print(f"🚀 Processing: {url}")
        
        # Detect platform
        platform = self.detect_platform(url)
        print(f"🎯 Platform: {platform}")
        
        # Try Playwright
        if PLAYWRIGHT_AVAILABLE:
            scraped_data = self.extract_with_playwright(url, platform)
            
            if scraped_data:
                # Save results
                json_file = self.save_results(scraped_data, scraped_data['output_folder'])
                
                print(f"✅ Success! Images: {scraped_data.get('media', {}).get('total_images', 0)}")
                print(f"📄 Data: {json_file}")
                
                return scraped_data
            else:
                print("❌ Browser automation failed")
        
        print("❌ All scraping methods failed")
        return None
    
    def scrape_batch(self, urls: list) -> list:
        """Scrape multiple URLs with rate limiting"""
        results = []
        
        for i, url in enumerate(urls):
            print(f"\n🔄 [{i+1}/{len(urls)}] Processing URL")
            
            result = self.scrape_url(url)
            if result:
                results.append(result)
            
            # Rate limiting between requests
            if i < len(urls) - 1:
                delay = random.uniform(5, 8)
                print(f"⏱️  Waiting {delay:.1f}s before next request...")
                time.sleep(delay)
        
        return results

def main():
    """Main function for CLI usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Universal Multi-Platform Scraper - Fixed Version')
    parser.add_argument('--batch', help='File with URLs (one per line)')
    parser.add_argument('--url', help='Single URL to scrape')
    parser.add_argument('--output', default='scraped_data', help='Output directory')
    
    args = parser.parse_args()
    
    # Initialize scraper
    scraper = FixedUniversalScraper()
    
    if args.batch:
        # Batch processing
        print(f"📚 Reading URLs from: {args.batch}")
        
        try:
            with open(args.batch, 'r', encoding='utf-8') as f:
                urls = [line.strip() for line in f if line.strip()]
        except Exception as e:
            print(f"❌ Error reading {args.batch}: {e}")
            return
        
        if not urls:
            print("❌ No URLs found in batch file")
            return
        
        print(f"📋 Found {len(urls)} URLs to process")
        
        results = scraper.scrape_batch(urls)
        
        print(f"\n🎉 Batch scraping completed!")
        print(f"✅ Successfully scraped: {len(results)}/{len(urls)} URLs")
        print(f"📁 Results saved in: {args.output}")
        
        # Summary
        for i, result in enumerate(results):
            platform = result.get('platform', 'unknown')
            images = result.get('media', {}).get('total_images', 0)
            print(f"  {i+1}. {platform}: {images} images")
        
    elif args.url:
        # Single URL processing
        result = scraper.scrape_url(args.url)
        
        if result:
            print(f"\n🎉 Scraping completed successfully!")
            print(f"📁 Results saved in: {args.output}")
        else:
            print(f"\n❌ Scraping failed!")
    
    else:
        print("❌ Please provide either --batch or --url argument")
        print("Example: python universal_scraper_windows.py --batch links.txt")
        print("Example: python universal_scraper_windows.py --url 'https://example.com'")

if __name__ == "__main__":
    main()
