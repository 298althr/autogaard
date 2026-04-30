"""
Universal Multi-Platform Scraper Framework
Scrapes any listing site (Zillow, Amazon, Cars.com, etc.) with browser automation
Avoids rate limiting through stealth techniques and intelligent extraction
"""

import uuid
import json
import os
import time
import random
import re
from datetime import datetime
from urllib.parse import urlparse, urljoin
from typing import Dict, List, Optional, Any

try:
    from playwright.sync_api import sync_playwright
    from playwright_stealth import stealth_async
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False

try:
    import requests
    from bs4 import BeautifulSoup
    BACKUP_AVAILABLE = True
except ImportError:
    BACKUP_AVAILABLE = False

class UniversalScraper:
    def __init__(self, config: Optional[Dict] = None):
        """Initialize universal scraper with configuration"""
        self.config = config or self.get_default_config()
        self.session = requests.Session() if BACKUP_AVAILABLE else None
        self.results = []
        
    def get_default_config(self) -> Dict:
        """Get default configuration"""
        return {
            "rate_limiting": {
                "delay_min": 2,
                "delay_max": 5,
                "concurrent_requests": 1
            },
            "browser_settings": {
                "headless": True,
                "stealth": True,
                "viewport": "random",
                "timeout": 30000
            },
            "proxy_rotation": {
                "enabled": False,
                "rotation_interval": 50
            },
            "output": {
                "base_dir": "scraped_data",
                "save_debug": True,
                "save_html": True
            }
        }
    
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
    
    def get_random_user_agent(self) -> str:
        """Get random user agent for anti-detection"""
        user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
        ]
        return random.choice(user_agents)
    
    def get_random_viewport(self) -> Dict:
        """Get random viewport for anti-detection"""
        viewports = [
            {'width': 1920, 'height': 1080},
            {'width': 1366, 'height': 768},
            {'width': 1440, 'height': 900},
            {'width': 1536, 'height': 864},
            {'width': 1280, 'height': 720}
        ]
        return random.choice(viewports)
    
    def create_output_folder(self, platform: str, url: str) -> str:
        """Create output folder with unique ID"""
        unique_id = str(uuid.uuid4())[:8]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        folder_name = f"{platform}_{unique_id}_{timestamp}"
        output_folder = os.path.join(self.config["output"]["base_dir"], folder_name)
        os.makedirs(output_folder, exist_ok=True)
        
        # Create photos subfolder
        photos_folder = os.path.join(output_folder, "photos")
        os.makedirs(photos_folder, exist_ok=True)
        
        return output_folder
    
    def extract_with_playwright(self, url: str, platform: str) -> Optional[Dict]:
        """Extract data using Playwright browser automation"""
        if not PLAYWRIGHT_AVAILABLE:
            return None
        
        try:
            with sync_playwright() as p:
                # Launch browser with stealth
                browser = p.chromium.launch(
                    headless=self.config["browser_settings"]["headless"],
                    args=[
                        '--no-sandbox',
                        '--disable-blink-features=AutomationControlled',
                        '--disable-dev-shm-usage'
                    ]
                )
                
                # Create context with random settings
                viewport = self.get_random_viewport() if self.config["browser_settings"]["viewport"] == "random" else {"width": 1920, "height": 1080}
                
                context = browser.new_context(
                    user_agent=self.get_random_user_agent(),
                    viewport=viewport,
                    locale='en-US',
                    timezone_id='America/New_York'
                )
                
                page = context.new_page()
                
                # Apply stealth mode
                if self.config["browser_settings"]["stealth"]:
                    page.add_init_script("""
                        Object.defineProperty(navigator, 'webdriver', {
                            get: () => undefined,
                        });
                    """)
                
                # Navigate to page
                page.goto(url, wait_until="networkidle", timeout=self.config["browser_settings"]["timeout"])
                
                # Wait for content to load
                time.sleep(random.uniform(2, 4))
                
                # Extract data based on platform
                data = self.extract_data_by_platform(page, platform, url)
                
                # Extract images
                images = self.extract_images_by_platform(page, platform, url)
                
                # Download images
                downloaded_images = self.download_images(page, images, os.path.join(os.path.dirname(data['output_folder']), "photos"))
                
                data['media']['images'] = downloaded_images
                data['media']['total_images'] = len(downloaded_images)
                
                browser.close()
                return data
                
        except Exception as e:
            print(f"❌ Playwright extraction failed: {e}")
            return None
    
    def extract_data_by_platform(self, page, platform: str, url: str) -> Dict:
        """Extract data based on platform-specific logic"""
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
            'platform_specific': {}
        }
        
        start_time = time.time()
        
        try:
            if platform == 'zillow':
                base_data.update(self.extract_zillow_data(page))
            elif platform == 'amazon':
                base_data.update(self.extract_amazon_data(page))
            elif platform == 'cars':
                base_data.update(self.extract_cars_data(page))
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
    
    def extract_zillow_data(self, page) -> Dict:
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
    
    def extract_amazon_data(self, page) -> Dict:
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
            
            # Extract specifications
            specs_table = page.query_selector('#productDetails_techSpec_section_1')
            if specs_table:
                rows = specs_table.query_selector_all('tr')
                for row in rows:
                    cells = row.query_selector_all('td')
                    if len(cells) >= 2:
                        key = cells[0].text_content().strip()
                        value = cells[1].text_content().strip()
                        data['item_data']['specifications'][key] = value
            
            # Extract Amazon-specific data
            asin_element = page.query_selector('[data-asin]')
            if asin_element:
                data['platform_specific']['asin'] = asin_element.get_attribute('data-asin')
            
        except Exception as e:
            print(f"❌ Amazon extraction error: {e}")
        
        return data
    
    def extract_cars_data(self, page) -> Dict:
        """Extract Cars.com-specific data"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            # Extract title
            title_element = page.query_selector('h1')
            if title_element:
                data['item_data']['title'] = title_element.text_content().strip()
            
            # Extract price
            price_elements = page.query_selector_all('[data-test="vehiclePrice"]')
            for element in price_elements:
                text = element.text_content()
                if text and '$' in text:
                    data['item_data']['price'] = text.strip()
                    break
            
            # Extract specifications
            spec_elements = page.query_selector_all('[data-test="vehicleDetails"]')
            for element in spec_elements:
                text = element.text_content()
                if ':' in text:
                    key, value = text.split(':', 1)
                    data['item_data']['specifications'][key.strip()] = value.strip()
            
            # Extract description
            desc_element = page.query_selector('[data-test="vehicleDescription"]')
            if desc_element:
                data['item_data']['description'] = desc_element.text_content().strip()
            
        except Exception as e:
            print(f"❌ Cars.com extraction error: {e}")
        
        return data
    
    def extract_ebay_data(self, page) -> Dict:
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
            
            # Extract description
            desc_element = page.query_selector('#desc_div')
            if desc_element:
                data['item_data']['description'] = desc_element.text_content().strip()
            
            # Extract eBay-specific data
            item_id_match = re.search(r'/itm/(\d+)', page.url)
            if item_id_match:
                data['platform_specific']['item_id'] = item_id_match.group(1)
            
        except Exception as e:
            print(f"❌ eBay extraction error: {e}")
        
        return data
    
    def extract_craigslist_data(self, page) -> Dict:
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
            
            # Extract location
            location_element = page.query_selector('.postinfo')
            if location_element:
                data['item_data']['location']['raw'] = location_element.text_content().strip()
            
        except Exception as e:
            print(f"❌ Craigslist extraction error: {e}")
        
        return data
    
    def extract_generic_data(self, page) -> Dict:
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
                if data['item_data']['price']:
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
    
    def extract_images_by_platform(self, page, platform: str, url: str) -> List[Dict]:
        """Extract images based on platform"""
        images = []
        
        try:
            if platform == 'zillow':
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
            
            elif platform == 'amazon':
                # Amazon-specific image extraction
                img_elements = page.query_selector_all('#landingImage, .a-dynamic-image img')
                for i, img in enumerate(img_elements):
                    src = img.get_attribute('src')
                    if src and 'amazon' in src:
                        images.append({
                            'url': src,
                            'filename': f'image_{i+1:02d}.jpg',
                            'platform': 'amazon'
                        })
            
            else:
                # Generic image extraction
                img_elements = page.query_selector_all('img')
                for i, img in enumerate(img_elements):
                    src = img.get_attribute('src')
                    if src and src.startswith('http') and not 'icon' in src.lower():
                        images.append({
                            'url': src,
                            'filename': f'image_{i+1:02d}.jpg',
                            'platform': 'generic'
                        })
        
        except Exception as e:
            print(f"❌ Image extraction error: {e}")
        
        return images[:20]  # Limit to 20 images
    
    def download_images(self, page, images: List[Dict], output_folder: str) -> List[Dict]:
        """Download images using browser context"""
        downloaded = []
        
        for i, image_info in enumerate(images):
            try:
                # Rate limiting
                time.sleep(random.uniform(0.5, 1.5))
                
                # Go to image URL
                response = page.goto(image_info['url'])
                
                if response and response.ok:
                    # Get image data
                    image_data = page.evaluate("""
                        () => {
                            const img = document.querySelector('img');
                            if (img) {
                                return {
                                    src: img.src,
                                    naturalWidth: img.naturalWidth,
                                    naturalHeight: img.naturalHeight
                                };
                            }
                            return null;
                        }
                    """)
                    
                    if image_data:
                        # Determine file extension
                        parsed_url = urlparse(image_data['url'])
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
                            'size_bytes': len(response.body()),
                            'dimensions': f"{image_data.get('naturalWidth', 0)}x{image_data.get('naturalHeight', 0)}"
                        })
                        
                        print(f"✅ Downloaded image: {filename}")
                
            except Exception as e:
                print(f"❌ Failed to download image {i+1}: {e}")
        
        return downloaded
    
    def save_results(self, data: Dict, output_folder: str) -> str:
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
    
    def scrape_url(self, url: str) -> Optional[Dict]:
        """Main scraping function - single URL"""
        print(f"🚀 Starting universal scraper")
        print(f"🌐 URL: {url}")
        print("=" * 60)
        
        # Detect platform
        platform = self.detect_platform(url)
        print(f"🎯 Detected platform: {platform}")
        
        # Create output folder
        output_folder = self.create_output_folder(platform, url)
        print(f"📁 Output folder: {output_folder}")
        
        # Add output folder to data
        data = {'output_folder': output_folder}
        
        # Try Playwright first
        if PLAYWRIGHT_AVAILABLE:
            print("🌐 Using browser automation...")
            scraped_data = self.extract_with_playwright(url, platform)
            
            if scraped_data:
                scraped_data['output_folder'] = output_folder
                
                # Save results
                json_file = self.save_results(scraped_data, output_folder)
                
                print("=" * 60)
                print("📊 SCRAPING RESULTS")
                print("=" * 60)
                print(f"🎯 Platform: {platform}")
                print(f"🏠 Title: {scraped_data.get('item_data', {}).get('title', 'N/A')}")
                print(f"💰 Price: {scraped_data.get('item_data', {}).get('price', 'N/A')}")
                print(f"📸 Images: {scraped_data.get('media', {}).get('total_images', 0)}")
                print(f"⏱️  Duration: {scraped_data.get('scraping_metadata', {}).get('duration_seconds', 0):.1f}s")
                print(f"📄 Data saved to: {json_file}")
                print("=" * 60)
                
                return scraped_data
            else:
                print("❌ Browser automation failed")
        
        # Fallback to HTTP requests
        if BACKUP_AVAILABLE:
            print("🔄 Trying HTTP requests fallback...")
            # Implement HTTP fallback here
            pass
        
        print("❌ All scraping methods failed")
        return None
    
    def scrape_batch(self, urls: List[str]) -> List[Dict]:
        """Scrape multiple URLs with rate limiting"""
        results = []
        
        for i, url in enumerate(urls):
            print(f"\n🔄 Processing URL {i+1}/{len(urls)}")
            
            result = self.scrape_url(url)
            if result:
                results.append(result)
            
            # Rate limiting between requests
            if i < len(urls) - 1:
                delay = random.uniform(
                    self.config["rate_limiting"]["delay_min"],
                    self.config["rate_limiting"]["delay_max"]
                )
                print(f"⏱️  Waiting {delay:.1f}s before next request...")
                time.sleep(delay)
        
        return results

def main():
    """Main function for CLI usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Universal Multi-Platform Scraper')
    parser.add_argument('--url', required=True, help='URL to scrape')
    parser.add_argument('--platform', help='Platform (auto-detected if not specified)')
    parser.add_argument('--batch', help='File with URLs (one per line)')
    parser.add_argument('--output', default='scraped_data', help='Output directory')
    
    args = parser.parse_args()
    
    # Initialize scraper
    config = UniversalScraper().get_default_config()
    config["output"]["base_dir"] = args.output
    scraper = UniversalScraper(config)
    
    if args.batch:
        # Batch processing
        with open(args.batch, 'r') as f:
            urls = [line.strip() for line in f if line.strip()]
        
        results = scraper.scrape_batch(urls)
        print(f"\n🎉 Batch scraping completed! Scraped {len(results)}/{len(urls)} URLs")
        
    else:
        # Single URL processing
        result = scraper.scrape_url(args.url)
        
        if result:
            print(f"\n🎉 Scraping completed successfully!")
        else:
            print(f"\n❌ Scraping failed!")

if __name__ == "__main__":
    main()
