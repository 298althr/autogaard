"""
Zillow Property Scraper - Dedicated Zillow Scraper
Specialized for Zillow.com property listings with photo and data extraction
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

class ZillowPropertyScraper:
    def __init__(self):
        self.results = []
        
    def create_output_folder(self, url: str) -> str:
        """Create output folder with unique ID"""
        unique_id = str(uuid.uuid4())[:8]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        folder_name = f"zillow_{unique_id}_{timestamp}"
        output_folder = os.path.join("scraped_data", folder_name)
        os.makedirs(output_folder, exist_ok=True)
        
        # Create photos subfolder
        photos_folder = os.path.join(output_folder, "photos")
        os.makedirs(photos_folder, exist_ok=True)
        
        return output_folder
    
    def extract_zillow_data(self, page, url: str) -> dict:
        """Extract Zillow-specific data with optimized selectors"""
        output_folder = self.create_output_folder(url)
        
        base_data = {
            'platform': 'zillow',
            'url': url,
            'scraping_metadata': {
                'timestamp': datetime.now().isoformat(),
                'method': 'browser_automation',
                'success_rate': 0,
                'duration_seconds': 0
            },
            'property_data': {
                'address': None,
                'price': None,
                'beds': None,
                'baths': None,
                'sqft': None,
                'description': None,
                'property_type': None,
                'year_built': None,
                'days_on_zillow': None,
                'price_per_sqft': None,
                'hoa_fees': None,
                'status': None,
                'special_features': None,
                'location': {
                    'city': None,
                    'state': None,
                    'zip': None,
                    'neighborhood': None,
                    'coordinates': {}
                },
                'agent': {
                    'name': None,
                    'phone': None,
                    'email': None,
                    'brokerage': None
                },
                'property_details': {},
                'facts_and_features': {}
            },
            'media': {
                'total_images': 0,
                'images': []
            },
            'zillow_specific': {
                'zpid': None,
                'mls_id': None,
                'property_url': url,
                'zillow_estimate': None,
                'rent_estimate': None
            },
            'output_folder': output_folder
        }
        
        start_time = time.time()
        
        try:
            print("🏠 Extracting Zillow property data...")
            
            # Extract address/title
            address_selectors = [
                '.ds-chip-property-address',  # Zillow 2024
                'h1[data-test="property-address"]',
                '.property-address h1',
                'h1[class*="address"]',
                '.address h1',
                'h1'
            ]
            
            for selector in address_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 5:
                            base_data['property_data']['address'] = text.strip()
                            print(f"✅ Found address: {text.strip()}")
                            break
                except:
                    continue
            
            # Extract price
            price_selectors = [
                '.ds-value',  # Zillow 2024
                '[data-test="price"]',
                '.price-value',
                'span[class*="price"]',
                '.price span'
            ]
            
            for selector in price_selectors:
                try:
                    elements = page.query_selector_all(selector, timeout=5000)
                    for element in elements:
                        text = element.text_content()
                        if text and '$' in text and len(text) > 6:
                            base_data['property_data']['price'] = text.strip()
                            print(f"✅ Found price: {text.strip()}")
                            break
                    if base_data['property_data'].get('price'):
                        break
                except:
                    continue
            
            # Extract beds, baths, sqft
            fact_selectors = [
                '.ds-home-fact',  # Zillow 2024
                '[data-test="beds"]',
                '[data-test="baths"]',
                '[data-test="sqft"]',
                '.home-fact',
                'span[class*="bed"]',
                'span[class*="bath"]',
                'span[class*="sqft"]'
            ]
            
            for selector in fact_selectors:
                try:
                    elements = page.query_selector_all(selector, timeout=5000)
                    for element in elements:
                        text = element.text_content()
                        if text:
                            if 'bed' in text.lower() and re.match(r'^\d+\s*beds?$', text, re.IGNORECASE):
                                base_data['property_data']['beds'] = text
                                print(f"✅ Found beds: {text}")
                            elif 'bath' in text.lower() and re.match(r'^\d+\s*baths?$', text, re.IGNORECASE):
                                base_data['property_data']['baths'] = text
                                print(f"✅ Found baths: {text}")
                            elif 'sqft' in text.lower() and re.match(r'^\d[\d,]*\s*sqft$', text, re.IGNORECASE):
                                base_data['property_data']['sqft'] = text
                                print(f"✅ Found sqft: {text}")
                except:
                    continue
            
            # Extract description
            desc_selectors = [
                '.ds-description',  # Zillow 2024
                '[data-test="description"]',
                '.description-content',
                '.property-description',
                'div[class*="description"]'
            ]
            
            for selector in desc_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 50:
                            base_data['property_data']['description'] = text.strip()
                            print(f"✅ Found description: {text.strip()[:100]}...")
                            break
                except:
                    continue
            
            # Extract "What's special" section
            special_selectors = [
                '.ds-what-special',  # Zillow 2024
                '[data-test="special-features"]',
                '.special-features',
                '.whats-special',
                'div[class*="special"]'
            ]
            
            for selector in special_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 10:
                            base_data['property_data']['special_features'] = text.strip()
                            print(f"✅ Found special features: {text.strip()[:100]}...")
                            break
                except:
                    continue
            
            # Extract property details
            detail_selectors = [
                '.ds-detail-item',  # Zillow 2024
                '[data-test="detail-item"]',
                '.detail-item',
                '.property-detail',
                'div[class*="detail"]'
            ]
            
            try:
                elements = page.query_selector_all(detail_selectors[0], timeout=5000)
                for element in elements:
                    text = element.text_content()
                    if text and ':' in text:
                        key, value = text.split(':', 1)
                        base_data['property_data']['property_details'][key.strip()] = value.strip()
            except:
                pass
            
            # Extract agent information
            agent_selectors = [
                '.ds-agent-name',  # Zillow 2024
                '[data-test="agent-name"]',
                '.agent-name',
                'div[class*="agent"]'
            ]
            
            for selector in agent_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 2:
                            base_data['property_data']['agent']['name'] = text.strip()
                            print(f"✅ Found agent: {text.strip()}")
                            break
                except:
                    continue
            
            # Extract Zillow-specific data
            url = page.url
            zpid_match = re.search(r'(\d+)_zpid', url)
            if zpid_match:
                base_data['zillow_specific']['zpid'] = zpid_match.group(1)
                print(f"✅ Found ZPID: {zpid_match.group(1)}")
            
            title = page.title()
            mls_match = re.search(r'MLS[_%20]+(\d+)', title, re.IGNORECASE)
            if mls_match:
                base_data['zillow_specific']['mls_id'] = mls_match.group(1)
                print(f"✅ Found MLS ID: {mls_match.group(1)}")
            
            base_data['scraping_metadata']['duration_seconds'] = time.time() - start_time
            base_data['scraping_metadata']['success_rate'] = 100
            
        except Exception as e:
            print(f"❌ Zillow data extraction error: {e}")
            base_data['scraping_metadata']['success_rate'] = 0
        
        return base_data
    
    def extract_zillow_images(self, page, url: str) -> list:
        """Extract Zillow property photos"""
        images = []
        
        try:
            print("🖼️ Extracting Zillow property photos...")
            
            # Method 1: Extract from JavaScript (most reliable)
            try:
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
                        'filename': f'photo_{i+1:02d}.webp',
                        'platform': 'zillow'
                    })
                
                print(f"✅ Found {len(photo_urls)} photos via JavaScript extraction")
                
            except Exception as js_error:
                print(f"⚠️ JavaScript extraction failed: {js_error}")
                
                # Method 2: Extract from DOM elements
                try:
                    img_selectors = [
                        'img[src*="photos.zillowstatic.com"]',
                        '.ds-photo-gallery img',
                        '.photo-gallery img',
                        'img[alt*="photo"]',
                        'img[alt*="property"]'
                    ]
                    
                    for selector in img_selectors:
                        try:
                            img_elements = page.query_selector_all(selector, timeout=5000)
                            for img in img_elements:
                                src = img.get_attribute('src')
                                if src and 'photos.zillowstatic.com' in src:
                                    images.append({
                                        'url': src,
                                        'filename': f'photo_{len(images)+1:02d}.webp',
                                        'platform': 'zillow'
                                    })
                            if images:
                                break
                        except:
                            continue
                    
                    print(f"✅ Found {len(images)} photos via DOM extraction")
                    
                except Exception as dom_error:
                    print(f"⚠️ DOM extraction failed: {dom_error}")
        
        except Exception as e:
            print(f"❌ Zillow image extraction error: {e}")
        
        print(f"✅ Total photos found: {len(images)}")
        return images[:50]  # Limit to 50 photos
    
    def download_zillow_images(self, page, images: list, output_folder: str) -> list:
        """Download Zillow property photos"""
        downloaded = []
        
        for i, image_info in enumerate(images):
            try:
                # Rate limiting
                time.sleep(random.uniform(0.3, 0.8))
                
                print(f"⬇️  Downloading photo {i+1}: {image_info['url'][:50]}...")
                
                # Go to image URL with timeout
                try:
                    response = page.goto(image_info['url'], timeout=30000)
                    
                    if response and response.ok:
                        # Determine file extension
                        parsed_url = urlparse(image_info['url'])
                        ext = os.path.splitext(parsed_url.path)[1] or '.webp'
                        
                        filename = f"photo_{i+1:02d}{ext}"
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
                        
                        print(f"✅ Downloaded photo: {filename}")
                    else:
                        print(f"⚠️ Failed to download photo {i+1}: HTTP {response.status if response else 'No response'}")
                        
                except Exception as download_error:
                    print(f"⚠️ Download error for photo {i+1}: {download_error}")
                
            except Exception as e:
                print(f"❌ Failed to download photo {i+1}: {e}")
        
        print(f"✅ Successfully downloaded {len(downloaded)}/{len(images)} photos")
        return downloaded
    
    def save_zillow_results(self, data: dict, output_folder: str) -> str:
        """Save Zillow results to JSON file"""
        json_file = os.path.join(output_folder, "zillow_property_data.json")
        
        try:
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"📄 Zillow data saved to: {json_file}")
            return json_file
            
        except Exception as e:
            print(f"❌ Failed to save Zillow data: {e}")
            return None
    
    def scrape_zillow_property(self, url: str) -> dict:
        """Main Zillow scraping function"""
        print(f"🏠 Processing Zillow property: {url}")
        
        if not PLAYWRIGHT_AVAILABLE:
            print("❌ Playwright not available")
            return None
        
        browsers_to_try = ['chromium', 'firefox', 'webkit']
        
        for browser_name in browsers_to_try:
            try:
                print(f"🌐 Launching {browser_name.upper()} browser for Zillow...")
                
                with sync_playwright() as p:
                    # Get browser instance
                    if browser_name == 'chromium':
                        browser = p.chromium.launch(
                            headless=False,  # Visible for debugging
                            args=[
                                '--no-sandbox',
                                '--disable-blink-features=AutomationControlled',
                                '--disable-dev-shm-usage',
                                '--disable-web-security',
                                '--disable-features=VizDisplayCompositor',
                                '--ignore-certificate-errors',
                                '--ignore-ssl-errors',
                                '--disable-gpu',
                                '--no-first-run',
                                '--no-default-browser-check',
                                '--disable-default-apps',
                                '--start-maximized'
                            ]
                        )
                    elif browser_name == 'firefox':
                        browser = p.firefox.launch(
                            headless=False,
                            firefox_user_prefs={
                                "network.http.phishy-userpass-length": 255,
                                "browser.safebrowsing.allowOverride": True,
                                "browser.safebrowsing.malware.enabled": False,
                                "browser.safebrowsing.phishing.enabled": False
                            }
                        )
                    else:  # webkit
                        browser = p.webkit.launch(headless=False)
                    
                    # Create context with anti-detection
                    context = browser.new_context(
                        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        viewport={'width': 1920, 'height': 1080},
                        locale='en-US',
                        ignore_https_errors=True,
                        accept_downloads=True,
                        java_script_enabled=True
                    )
                    
                    page = context.new_page()
                    
                    # Set anti-detection
                    page.add_init_script("""
                        Object.defineProperty(navigator, 'webdriver', {
                            get: () => undefined,
                        });
                        Object.defineProperty(navigator, 'plugins', {
                            get: () => [1, 2, 3, 4, 5],
                        });
                        Object.defineProperty(navigator, 'languages', {
                            get: () => ['en-US', 'en'],
                        });
                    """)
                    
                    print(f"📡 Navigating to Zillow property: {url}")
                    
                    # Navigate to Zillow property
                    response = page.goto(url, wait_until="domcontentloaded", timeout=60000)
                    
                    if response and response.ok:
                        print(f"✅ Zillow page loaded successfully! Status: {response.status}")
                        
                        # Wait for content to load
                        time.sleep(5)
                        
                        # Check page title
                        page_title = page.title()
                        print(f"📄 Zillow page title: {page_title}")
                        
                        # Scroll to trigger lazy loading
                        try:
                            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                            time.sleep(2)
                            page.evaluate("window.scrollTo(0, 0)")
                            time.sleep(1)
                        except:
                            pass
                        
                        # Extract Zillow data
                        print("🔍 Extracting Zillow property data...")
                        data = self.extract_zillow_data(page, url)
                        
                        # Extract Zillow images
                        print("🖼️ Extracting Zillow property photos...")
                        images = self.extract_zillow_images(page, url)
                        
                        # Download images
                        if images:
                            photos_folder = os.path.join(data['output_folder'], "photos")
                            downloaded_images = self.download_zillow_images(page, images, photos_folder)
                            
                            data['media']['images'] = downloaded_images
                            data['media']['total_images'] = len(downloaded_images)
                            print(f"✅ Downloaded {len(downloaded_images)} Zillow photos")
                        else:
                            print("⚠️ No Zillow photos found")
                            data['media']['images'] = []
                            data['media']['total_images'] = 0
                        
                        data['scraping_metadata']['browser_used'] = browser_name
                        
                        # Wait before closing
                        time.sleep(2)
                        
                        browser.close()
                        print(f"✅ {browser_name.upper()} browser closed successfully!")
                        
                        # Save results
                        json_file = self.save_zillow_results(data, data['output_folder'])
                        
                        print(f"🎉 ZILLOW EXTRACTION COMPLETED!")
                        print(f"📊 Total photos: {data.get('media', {}).get('total_images', 0)}")
                        print(f"📄 Data file: {json_file}")
                        print(f"🌐 Browser used: {browser_name}")
                        
                        return data
                    else:
                        print(f"❌ Failed to load Zillow page: HTTP {response.status if response else 'Unknown'}")
                        browser.close()
                        continue
                        
            except Exception as e:
                print(f"❌ {browser_name.upper()} browser failed for Zillow: {e}")
                continue
        
        print("❌ All browsers failed for Zillow scraping")
        return None
    
    def scrape_zillow_batch(self, urls: list) -> list:
        """Scrape multiple Zillow properties"""
        results = []
        
        for i, url in enumerate(urls):
            print(f"\n🔄 [{i+1}/{len(urls)}] Processing Zillow property")
            
            result = self.scrape_zillow_property(url)
            if result:
                results.append(result)
            
            # Rate limiting between requests
            if i < len(urls) - 1:
                delay = random.uniform(8, 12)
                print(f"⏱️  Waiting {delay:.1f}s before next Zillow property...")
                time.sleep(delay)
        
        return results

def main():
    """Main function for CLI usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Zillow Property Scraper - Dedicated Zillow Scraper')
    parser.add_argument('--batch', help='File with Zillow URLs (one per line)')
    parser.add_argument('--url', help='Single Zillow URL to scrape')
    parser.add_argument('--output', default='scraped_data', help='Output directory')
    
    args = parser.parse_args()
    
    # Initialize Zillow scraper
    scraper = ZillowPropertyScraper()
    
    if args.batch:
        # Batch processing
        print(f"📚 Reading Zillow URLs from: {args.batch}")
        
        try:
            with open(args.batch, 'r', encoding='utf-8') as f:
                urls = [line.strip() for line in f if line.strip() and 'zillow.com' in line.lower()]
        except Exception as e:
            print(f"❌ Error reading {args.batch}: {e}")
            return
        
        if not urls:
            print("❌ No Zillow URLs found in batch file")
            return
        
        print(f"📋 Found {len(urls)} Zillow properties to process")
        
        results = scraper.scrape_zillow_batch(urls)
        
        print(f"\n🎉 ZILLOW BATCH SCRAPING COMPLETED!")
        print(f"✅ Successfully scraped: {len(results)}/{len(urls)} Zillow properties")
        print(f"📁 Results saved in: {args.output}")
        
        # Summary
        for i, result in enumerate(results):
            images = result.get('media', {}).get('total_images', 0)
            browser = result.get('scraping_metadata', {}).get('browser_used', 'unknown')
            address = result.get('property_data', {}).get('address', 'Unknown')
            print(f"  {i+1}. {address[:30]}...: {images} photos (browser: {browser})")
        
    elif args.url:
        # Single URL processing
        if 'zillow.com' not in args.url.lower():
            print("❌ URL must be a Zillow property URL")
            return
        
        result = scraper.scrape_zillow_property(args.url)
        
        if result:
            print(f"\n🎉 ZILLOW SCRAPING COMPLETED SUCCESSFULLY!")
            print(f"📁 Results saved in: {args.output}")
        else:
            print(f"\n❌ ZILLOW SCRAPING FAILED!")
    
    else:
        print("❌ Please provide either --batch or --url argument")
        print("Example: python zillow_scraper.py --batch zillow_links.txt")
        print("Example: python zillow_scraper.py --url 'https://www.zillow.com/homedetails/...'")

if __name__ == "__main__":
    main()
