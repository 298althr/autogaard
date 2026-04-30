"""
Cars.com Vehicle Scraper - Dedicated Cars.com Scraper
Specialized for Cars.com vehicle listings with photo and data extraction
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

class CarsComVehicleScraper:
    def __init__(self):
        self.results = []
        
    def create_output_folder(self, url: str) -> str:
        """Create output folder with unique ID"""
        unique_id = str(uuid.uuid4())[:8]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        folder_name = f"cars_{unique_id}_{timestamp}"
        output_folder = os.path.join("scraped_data", folder_name)
        os.makedirs(output_folder, exist_ok=True)
        
        # Create photos subfolder
        photos_folder = os.path.join(output_folder, "photos")
        os.makedirs(photos_folder, exist_ok=True)
        
        return output_folder
    
    def extract_cars_data(self, page, url: str) -> dict:
        """Extract Cars.com-specific data with optimized selectors"""
        output_folder = self.create_output_folder(url)
        
        base_data = {
            'platform': 'cars',
            'url': url,
            'scraping_metadata': {
                'timestamp': datetime.now().isoformat(),
                'method': 'browser_automation',
                'success_rate': 0,
                'duration_seconds': 0
            },
            'vehicle_data': {
                'title': None,
                'price': None,
                'year': None,
                'make': None,
                'model': None,
                'trim': None,
                'mileage': None,
                'transmission': None,
                'engine': None,
                'drivetrain': None,
                'fuel_type': None,
                'exterior_color': None,
                'interior_color': None,
                'vin': None,
                'stock_number': None,
                'body_style': None,
                'condition': None,
                'description': None,
                'dealer': {
                    'name': None,
                    'phone': None,
                    'address': None,
                    'city': None,
                    'state': None,
                    'zip': None
                },
                'specifications': {},
                'features': [],
                'safety_features': [],
                'entertainment_features': []
            },
            'media': {
                'total_images': 0,
                'images': []
            },
            'cars_specific': {
                'vehicle_id': None,
                'listing_id': None,
                'days_on_site': None,
                'price_drop': None,
                'original_price': None
            },
            'output_folder': output_folder
        }
        
        start_time = time.time()
        
        try:
            print("🚗 Extracting Cars.com vehicle data...")
            
            # Extract title
            title_selectors = [
                'h1.heading',  # Cars.com 2024
                'h1.vehicle-heading',
                'h1.listing-title',
                'h1[class*="title"]',
                'h1[data-cmp="heading"]',
                'h1[data-test="vehicleTitle"]',
                '.vehicle-title h1',
                '.listing-title h1',
                '[data-qa="vehicleTitle"] h1',
                '.title h1',
                'h1'
            ]
            
            for selector in title_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 5:
                            base_data['vehicle_data']['title'] = text.strip()
                            print(f"✅ Found title: {text.strip()}")
                            break
                except:
                    continue
            
            # Extract price
            price_selectors = [
                '.price-primary',  # Cars.com 2024
                '.price-amount',
                '.pricing-price',
                '[data-cmp="price"]',
                '[data-test="vehiclePrice"]',
                '.price-value',
                '.vehicle-price',
                '.listing-price',
                '[data-qa="price"]',
                'span[class*="price"]',
                '.price span',
                '[class*="price"] span'
            ]
            
            for selector in price_selectors:
                try:
                    elements = page.query_selector_all(selector, timeout=5000)
                    for element in elements:
                        text = element.text_content()
                        if text and '$' in text and len(text) > 3:
                            base_data['vehicle_data']['price'] = text.strip()
                            print(f"✅ Found price: {text.strip()}")
                            break
                    if base_data['vehicle_data'].get('price'):
                        break
                except:
                    continue
            
            # Extract specifications
            spec_patterns = [
                ('year', [
                    '.year-value',
                    '.vehicle-year',
                    '[data-test="vehicleYear"]',
                    '[data-qa="year"]',
                    'span[class*="year"]',
                    '.year span',
                    '[class*="year"] span'
                ]),
                ('make', [
                    '.make-value',
                    '.vehicle-make',
                    '[data-test="vehicleMake"]',
                    '[data-qa="make"]',
                    'span[class*="make"]',
                    '.make span',
                    '[class*="make"] span'
                ]),
                ('model', [
                    '.model-value',
                    '.vehicle-model',
                    '[data-test="vehicleModel"]',
                    '[data-qa="model"]',
                    'span[class*="model"]',
                    '.model span',
                    '[class*="model"] span'
                ]),
                ('mileage', [
                    '.mileage-value',
                    '.vehicle-mileage',
                    '[data-test="vehicleMileage"]',
                    '[data-qa="mileage"]',
                    'span[class*="mileage"]',
                    '.mileage span',
                    '[class*="mileage"] span'
                ]),
                ('transmission', [
                    '.transmission-value',
                    '.vehicle-transmission',
                    '[data-test="vehicleTransmission"]',
                    '[data-qa="transmission"]',
                    'span[class*="transmission"]',
                    '.transmission span',
                    '[class*="transmission"] span'
                ]),
                ('engine', [
                    '.engine-value',
                    '.vehicle-engine',
                    '[data-test="vehicleEngine"]',
                    '[data-qa="engine"]',
                    'span[class*="engine"]',
                    '.engine span',
                    '[class*="engine"] span'
                ]),
                ('drivetrain', [
                    '.drivetrain-value',
                    '.vehicle-drivetrain',
                    '[data-test="vehicleDrivetrain"]',
                    '[data-qa="drivetrain"]',
                    'span[class*="drivetrain"]',
                    '.drivetrain span',
                    '[class*="drivetrain"] span'
                ]),
                ('fuel_type', [
                    '.fuel-value',
                    '.vehicle-fuel',
                    '[data-test="vehicleFuelType"]',
                    '[data-qa="fuel-type"]',
                    'span[class*="fuel"]',
                    '.fuel span',
                    '[class*="fuel"] span'
                ]),
                ('exterior_color', [
                    '.exterior-color-value',
                    '.vehicle-exterior',
                    '[data-test="vehicleExteriorColor"]',
                    '[data-qa="exterior-color"]',
                    'span[class*="exterior"]',
                    '.exterior span',
                    '[class*="exterior"] span'
                ]),
                ('interior_color', [
                    '.interior-color-value',
                    '.vehicle-interior',
                    '[data-test="vehicleInteriorColor"]',
                    '[data-qa="interior-color"]',
                    'span[class*="interior"]',
                    '.interior span',
                    '[class*="interior"] span'
                ]),
                ('vin', [
                    '.vin-value',
                    '.vehicle-vin',
                    '[data-test="vehicleVin"]',
                    '[data-qa="vin"]',
                    'span[class*="vin"]',
                    '.vin span',
                    '[class*="vin"] span'
                ]),
                ('stock_number', [
                    '.stock-number-value',
                    '.vehicle-stock',
                    '[data-test="vehicleStockNumber"]',
                    '[data-qa="stock-number"]',
                    'span[class*="stock"]',
                    '.stock span',
                    '[class*="stock"] span'
                ])
            ]
            
            specs_found = 0
            for spec_name, selectors in spec_patterns:
                for selector in selectors:
                    try:
                        element = page.query_selector(selector, timeout=3000)
                        if element:
                            text = element.text_content()
                            if text and text.strip():
                                base_data['vehicle_data'][spec_name] = text.strip()
                                specs_found += 1
                                print(f"✅ Found {spec_name}: {text.strip()}")
                                break
                    except:
                        continue
            
            print(f"✅ Found {specs_found} specifications")
            
            # Extract description
            desc_selectors = [
                '.description-text',
                '.vehicle-description',
                '.listing-description',
                '[data-test="vehicleDescription"]',
                '[data-qa="description"]',
                '[data-cmp="description"]',
                '.description-content',
                '.vehicle-details',
                'div[class*="description"]',
                '.description div'
            ]
            
            for selector in desc_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 20:
                            base_data['vehicle_data']['description'] = text.strip()
                            print(f"✅ Found description: {text.strip()[:100]}...")
                            break
                except:
                    continue
            
            # Extract dealer information
            dealer_selectors = [
                '.dealer-name',
                '.seller-name',
                '.vehicle-seller',
                '[data-test="sellerName"]',
                '[data-qa="seller"]',
                '[data-cmp="seller"]',
                'span[class*="seller"]',
                '.seller span',
                '[class*="seller"] span'
            ]
            
            for selector in dealer_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and text.strip():
                            base_data['vehicle_data']['dealer']['name'] = text.strip()
                            print(f"✅ Found dealer: {text.strip()}")
                            break
                except:
                    continue
            
            # Extract Cars.com specific data
            url = page.url
            id_match = re.search(r'vehicledetail/([^/]+)', url)
            if id_match:
                base_data['cars_specific']['vehicle_id'] = id_match.group(1)
                print(f"✅ Found vehicle ID: {id_match.group(1)}")
            
            base_data['scraping_metadata']['duration_seconds'] = time.time() - start_time
            base_data['scraping_metadata']['success_rate'] = 100
            
        except Exception as e:
            print(f"❌ Cars.com data extraction error: {e}")
            base_data['scraping_metadata']['success_rate'] = 0
        
        return base_data
    
    def extract_cars_images(self, page, url: str) -> list:
        """Extract Cars.com vehicle photos"""
        images = []
        
        try:
            print("🖼️ Extracting Cars.com vehicle photos...")
            
            # Cars.com image selectors (2024 updated)
            img_selectors = [
                'img[src*="photos.cars.com"]',  # Cars.com CDN
                '.gallery img',
                '.photo-gallery img',
                '.vehicle-photo img',
                '.listing-photo img',
                '[data-test="gallery"] img',
                '[data-qa="photo"] img',
                '[data-cmp="gallery"] img',
                'img[class*="photo"]',
                'img[class*="vehicle"]',
                'img[alt*="vehicle"]',
                'img[alt*="photo"]',
                '.carousel img',
                '.slider img'
            ]
            
            for selector in img_selectors:
                try:
                    img_elements = page.query_selector_all(selector, timeout=5000)
                    print(f"📸 Selector '{selector}' found {len(img_elements)} images")
                    for img in img_elements:
                        src = img.get_attribute('src')
                        if src and src.startswith('http') and len(src) > 20:
                            images.append({
                                'url': src,
                                'filename': f'vehicle_photo_{len(images)+1:02d}.jpg',
                                'platform': 'cars'
                            })
                    if images:
                        break
                except:
                    continue
        
        except Exception as e:
            print(f"❌ Cars.com image extraction error: {e}")
        
        print(f"✅ Found {len(images)} vehicle photos")
        return images[:30]  # Limit to 30 photos
    
    def download_cars_images(self, page, images: list, output_folder: str) -> list:
        """Download Cars.com vehicle photos"""
        downloaded = []
        
        for i, image_info in enumerate(images):
            try:
                # Rate limiting
                time.sleep(random.uniform(0.3, 0.8))
                
                print(f"⬇️  Downloading vehicle photo {i+1}: {image_info['url'][:50]}...")
                
                # Go to image URL with timeout
                try:
                    response = page.goto(image_info['url'], timeout=30000)
                    
                    if response and response.ok:
                        # Determine file extension
                        parsed_url = urlparse(image_info['url'])
                        ext = os.path.splitext(parsed_url.path)[1] or '.jpg'
                        
                        filename = f"vehicle_photo_{i+1:02d}{ext}"
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
                        
                        print(f"✅ Downloaded vehicle photo: {filename}")
                    else:
                        print(f"⚠️ Failed to download vehicle photo {i+1}: HTTP {response.status if response else 'No response'}")
                        
                except Exception as download_error:
                    print(f"⚠️ Download error for vehicle photo {i+1}: {download_error}")
                
            except Exception as e:
                print(f"❌ Failed to download vehicle photo {i+1}: {e}")
        
        print(f"✅ Successfully downloaded {len(downloaded)}/{len(images)} vehicle photos")
        return downloaded
    
    def save_cars_results(self, data: dict, output_folder: str) -> str:
        """Save Cars.com results to JSON file"""
        json_file = os.path.join(output_folder, "cars_vehicle_data.json")
        
        try:
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"📄 Cars.com data saved to: {json_file}")
            return json_file
            
        except Exception as e:
            print(f"❌ Failed to save Cars.com data: {e}")
            return None
    
    def scrape_cars_vehicle(self, url: str) -> dict:
        """Main Cars.com scraping function"""
        print(f"🚗 Processing Cars.com vehicle: {url}")
        
        if not PLAYWRIGHT_AVAILABLE:
            print("❌ Playwright not available")
            return None
        
        browsers_to_try = ['chromium', 'firefox', 'webkit']
        
        for browser_name in browsers_to_try:
            try:
                print(f"🌐 Launching {browser_name.upper()} browser for Cars.com...")
                
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
                    
                    print(f"📡 Navigating to Cars.com vehicle: {url}")
                    
                    # Navigate to Cars.com vehicle
                    response = page.goto(url, wait_until="domcontentloaded", timeout=60000)
                    
                    if response and response.ok:
                        print(f"✅ Cars.com page loaded successfully! Status: {response.status}")
                        
                        # Wait for content to load
                        time.sleep(5)
                        
                        # Check page title
                        page_title = page.title()
                        print(f"📄 Cars.com page title: {page_title}")
                        
                        # Scroll to trigger lazy loading
                        try:
                            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                            time.sleep(2)
                            page.evaluate("window.scrollTo(0, 0)")
                            time.sleep(1)
                        except:
                            pass
                        
                        # Extract Cars.com data
                        print("🔍 Extracting Cars.com vehicle data...")
                        data = self.extract_cars_data(page, url)
                        
                        # Extract Cars.com images
                        print("🖼️ Extracting Cars.com vehicle photos...")
                        images = self.extract_cars_images(page, url)
                        
                        # Download images
                        if images:
                            photos_folder = os.path.join(data['output_folder'], "photos")
                            downloaded_images = self.download_cars_images(page, images, photos_folder)
                            
                            data['media']['images'] = downloaded_images
                            data['media']['total_images'] = len(downloaded_images)
                            print(f"✅ Downloaded {len(downloaded_images)} Cars.com photos")
                        else:
                            print("⚠️ No Cars.com photos found")
                            data['media']['images'] = []
                            data['media']['total_images'] = 0
                        
                        data['scraping_metadata']['browser_used'] = browser_name
                        
                        # Wait before closing
                        time.sleep(2)
                        
                        browser.close()
                        print(f"✅ {browser_name.upper()} browser closed successfully!")
                        
                        # Save results
                        json_file = self.save_cars_results(data, data['output_folder'])
                        
                        print(f"🎉 CARS.COM EXTRACTION COMPLETED!")
                        print(f"📊 Total photos: {data.get('media', {}).get('total_images', 0)}")
                        print(f"📄 Data file: {json_file}")
                        print(f"🌐 Browser used: {browser_name}")
                        
                        return data
                    else:
                        print(f"❌ Failed to load Cars.com page: HTTP {response.status if response else 'Unknown'}")
                        browser.close()
                        continue
                        
            except Exception as e:
                print(f"❌ {browser_name.upper()} browser failed for Cars.com: {e}")
                continue
        
        print("❌ All browsers failed for Cars.com scraping")
        return None
    
    def scrape_cars_batch(self, urls: list) -> list:
        """Scrape multiple Cars.com vehicles"""
        results = []
        
        for i, url in enumerate(urls):
            print(f"\n🔄 [{i+1}/{len(urls)}] Processing Cars.com vehicle")
            
            result = self.scrape_cars_vehicle(url)
            if result:
                results.append(result)
            
            # Rate limiting between requests
            if i < len(urls) - 1:
                delay = random.uniform(8, 12)
                print(f"⏱️  Waiting {delay:.1f}s before next Cars.com vehicle...")
                time.sleep(delay)
        
        return results

def main():
    """Main function for CLI usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Cars.com Vehicle Scraper - Dedicated Cars.com Scraper')
    parser.add_argument('--batch', help='File with Cars.com URLs (one per line)')
    parser.add_argument('--url', help='Single Cars.com URL to scrape')
    parser.add_argument('--output', default='scraped_data', help='Output directory')
    
    args = parser.parse_args()
    
    # Initialize Cars.com scraper
    scraper = CarsComVehicleScraper()
    
    if args.batch:
        # Batch processing
        print(f"📚 Reading Cars.com URLs from: {args.batch}")
        
        try:
            with open(args.batch, 'r', encoding='utf-8') as f:
                urls = [line.strip() for line in f if line.strip() and 'cars.com' in line.lower()]
        except Exception as e:
            print(f"❌ Error reading {args.batch}: {e}")
            return
        
        if not urls:
            print("❌ No Cars.com URLs found in batch file")
            return
        
        print(f"📋 Found {len(urls)} Cars.com vehicles to process")
        
        results = scraper.scrape_cars_batch(urls)
        
        print(f"\n🎉 CARS.COM BATCH SCRAPING COMPLETED!")
        print(f"✅ Successfully scraped: {len(results)}/{len(urls)} Cars.com vehicles")
        print(f"📁 Results saved in: {args.output}")
        
        # Summary
        for i, result in enumerate(results):
            images = result.get('media', {}).get('total_images', 0)
            browser = result.get('scraping_metadata', {}).get('browser_used', 'unknown')
            title = result.get('vehicle_data', {}).get('title', 'Unknown')
            print(f"  {i+1}. {title[:30]}...: {images} photos (browser: {browser})")
        
    elif args.url:
        # Single URL processing
        if 'cars.com' not in args.url.lower():
            print("❌ URL must be a Cars.com vehicle URL")
            return
        
        result = scraper.scrape_cars_vehicle(args.url)
        
        if result:
            print(f"\n🎉 CARS.COM SCRAPING COMPLETED SUCCESSFULLY!")
            print(f"📁 Results saved in: {args.output}")
        else:
            print(f"\n❌ CARS.COM SCRAPING FAILED!")
    
    else:
        print("❌ Please provide either --batch or --url argument")
        print("Example: python cars_scraper.py --batch cars_links.txt")
        print("Example: python cars_scraper.py --url 'https://www.cars.com/vehicledetail/...'")

if __name__ == "__main__":
    main()
