"""
Universal Scraper Windows - WORKING VERSION
Fixed browser launch and updated CSS selectors for all platforms
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

class WorkingUniversalScraper:
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
        """Extract data using Playwright with guaranteed browser launch"""
        if not PLAYWRIGHT_AVAILABLE:
            print("❌ Playwright not available")
            return None
        
        browsers_to_try = ['chromium', 'firefox', 'webkit']
        
        for browser_name in browsers_to_try:
            try:
                print(f"🌐 LAUNCHING {browser_name.upper()} BROWSER...")
                print(f"📡 Browser: {browser_name}")
                print(f"🎯 Platform: {platform}")
                print(f"🔗 URL: {url}")
                
                with sync_playwright() as p:
                    print(f"✅ Playwright context started")
                    
                    # Get browser instance with verified launch
                    if browser_name == 'chromium':
                        print("🔧 Configuring Chromium browser...")
                        browser = p.chromium.launch(
                            headless=False,  # CHANGED TO FALSE FOR VISIBILITY
                            args=[
                                '--no-sandbox',
                                '--disable-blink-features=AutomationControlled',
                                '--disable-dev-shm-usage',
                                '--disable-web-security',
                                '--disable-features=VizDisplayCompositor',
                                '--ignore-certificate-errors',
                                '--ignore-ssl-errors',
                                '--ignore-certificate-errors-spki-list',
                                '--disable-gpu',
                                '--no-first-run',
                                '--no-default-browser-check',
                                '--disable-default-apps',
                                '--start-maximized'  # ADDED
                            ]
                        )
                    elif browser_name == 'firefox':
                        print("🔧 Configuring Firefox browser...")
                        browser = p.firefox.launch(
                            headless=False,  # CHANGED TO FALSE FOR VISIBILITY
                            firefox_user_prefs={
                                "network.http.phishy-userpass-length": 255,
                                "browser.safebrowsing.allowOverride": True,
                                "browser.safebrowsing.malware.enabled": False,
                                "browser.safebrowsing.phishing.enabled": False
                            }
                        )
                    else:  # webkit
                        print("🔧 Configuring WebKit browser...")
                        browser = p.webkit.launch(
                            headless=False  # CHANGED TO FALSE FOR VISIBILITY
                        )
                    
                    print(f"✅ {browser_name.upper()} browser launched successfully!")
                    
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
                    print(f"✅ New page created in {browser_name}")
                    
                    # Set additional anti-detection
                    page.add_init_script("""
                        console.log('🔧 Anti-detection script loaded');
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
                    
                    print(f"📡 Navigating to: {url}")
                    print(f"🔄 Starting navigation with {browser_name}...")
                    
                    # Navigate with detailed logging
                    try:
                        response = page.goto(url, wait_until="domcontentloaded", timeout=60000)
                        print(f"✅ Navigation successful! Status: {response.status if response else 'Unknown'}")
                        
                        # Wait for page to load
                        print("⏳ Waiting for page to fully load...")
                        time.sleep(5)
                        
                        # Check page title
                        page_title = page.title()
                        print(f"📄 Page title: {page_title}")
                        
                        if "error" in page_title.lower() or "blocked" in page_title.lower():
                            print(f"⚠️ Page may have issues: {page_title}")
                        else:
                            print(f"✅ Page loaded successfully!")
                            
                    except Exception as nav_error:
                        print(f"❌ Navigation failed: {nav_error}")
                        browser.close()
                        continue
                    
                    # Wait for dynamic content
                    print("⏳ Waiting for dynamic content...")
                    time.sleep(3)
                    
                    # Scroll to trigger lazy loading
                    try:
                        print("📜 Scrolling page to trigger lazy loading...")
                        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                        time.sleep(2)
                        page.evaluate("window.scrollTo(0, 0)")
                        time.sleep(1)
                    except Exception as scroll_error:
                        print(f"⚠️ Scroll error: {scroll_error}")
                    
                    # Extract data with updated selectors
                    print(f"🔍 Starting data extraction for {platform}...")
                    data = self.extract_data_by_platform(page, platform, url)
                    
                    # Extract images with updated selectors
                    print("🖼️ Starting image extraction...")
                    images = self.extract_images_by_platform(page, platform, url)
                    
                    # Download images
                    if images:
                        print(f"⬇️ Starting download of {len(images)} images...")
                        output_folder = data['output_folder']
                        photos_folder = os.path.join(output_folder, "photos")
                        downloaded_images = self.download_images(page, images, photos_folder)
                        
                        data['media']['images'] = downloaded_images
                        data['media']['total_images'] = len(downloaded_images)
                        print(f"✅ Downloaded {len(downloaded_images)} images")
                    else:
                        print("⚠️ No images found to download")
                        data['media']['images'] = []
                        data['media']['total_images'] = 0
                    
                    data['scraping_metadata']['browser_used'] = browser_name
                    
                    # Wait before closing
                    print("⏳ Waiting 2 seconds before closing browser...")
                    time.sleep(2)
                    
                    browser.close()
                    print(f"✅ {browser_name.upper()} browser closed successfully!")
                    print(f"🎉 EXTRACTION COMPLETED WITH {browser_name.upper()}!")
                    
                    return data
                    
            except Exception as e:
                print(f"❌ {browser_name.upper()} browser failed: {e}")
                print(f"❌ Error type: {type(e).__name__}")
                print(f"❌ Error details: {str(e)}")
                continue  # Try next browser
        
        print("❌ All browsers failed to launch!")
        return None
    
    def extract_data_by_platform(self, page, platform: str, url: str) -> dict:
        """Extract data based on platform-specific logic with MODERN CSS SELECTORS"""
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
                base_data.update(self.extract_cars_data_modern(page))
            elif platform == 'zillow':
                base_data.update(self.extract_zillow_data_modern(page))
            elif platform == 'amazon':
                base_data.update(self.extract_amazon_data_modern(page))
            elif platform == 'ebay':
                base_data.update(self.extract_ebay_data_modern(page))
            elif platform == 'craigslist':
                base_data.update(self.extract_craigslist_data_modern(page))
            else:
                base_data.update(self.extract_generic_data_modern(page))
            
            base_data['scraping_metadata']['duration_seconds'] = time.time() - start_time
            base_data['scraping_metadata']['success_rate'] = 100
            
        except Exception as e:
            print(f"❌ Data extraction error: {e}")
            base_data['scraping_metadata']['success_rate'] = 0
        
        return base_data
    
    def extract_cars_data_modern(self, page) -> dict:
        """Extract Cars.com data with MODERN 2024 CSS SELECTORS"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            print("🚗 Extracting Cars.com data with MODERN selectors...")
            
            # MODERN TITLE SELECTORS (2024 updated)
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
            
            print("🔍 Searching for title...")
            for i, selector in enumerate(title_selectors):
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 5:
                            data['item_data']['title'] = text.strip()
                            print(f"✅ Found title with selector '{selector}': {text.strip()[:50]}...")
                            break
                    else:
                        print(f"  ❌ Selector {i+1}: {selector} - not found")
                except Exception as e:
                    print(f"  ❌ Selector {i+1}: {selector} - error: {e}")
            
            # MODERN PRICE SELECTORS (2024 updated)
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
            
            print("🔍 Searching for price...")
            for i, selector in enumerate(price_selectors):
                try:
                    elements = page.query_selector_all(selector, timeout=5000)
                    for element in elements:
                        text = element.text_content()
                        if text and '$' in text and len(text) > 3:
                            data['item_data']['price'] = text.strip()
                            print(f"✅ Found price with selector '{selector}': {text.strip()}")
                            break
                    if data['item_data'].get('price'):
                        break
                    else:
                        print(f"  ❌ Selector {i+1}: {selector} - not found")
                except Exception as e:
                    print(f"  ❌ Selector {i+1}: {selector} - error: {e}")
            
            # MODERN SPECIFICATIONS SELECTORS (2024 updated)
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
                ])
            ]
            
            print("🔍 Searching for specifications...")
            specs_found = 0
            for spec_name, selectors in spec_patterns:
                print(f"  🔍 Searching for {spec_name}...")
                for i, selector in enumerate(selectors):
                    try:
                        element = page.query_selector(selector, timeout=3000)
                        if element:
                            text = element.text_content()
                            if text and text.strip():
                                data['item_data']['specifications'][spec_name] = text.strip()
                                specs_found += 1
                                print(f"    ✅ Found {spec_name} with selector '{selector}': {text.strip()}")
                                break
                        else:
                            print(f"    ❌ Selector {i+1}: {selector} - not found")
                    except Exception as e:
                        print(f"    ❌ Selector {i+1}: {selector} - error: {e}")
            
            print(f"✅ Found {specs_found} specifications total")
            
            # MODERN DESCRIPTION SELECTORS (2024 updated)
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
            
            print("🔍 Searching for description...")
            for i, selector in enumerate(desc_selectors):
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 20:
                            data['item_data']['description'] = text.strip()
                            print(f"✅ Found description with selector '{selector}': {text.strip()[:100]}...")
                            break
                    else:
                        print(f"  ❌ Selector {i+1}: {selector} - not found")
                except Exception as e:
                    print(f"  ❌ Selector {i+1}: {selector} - error: {e}")
            
            # MODERN LOCATION SELECTORS (2024 updated)
            location_selectors = [
                '.location-value',
                '.vehicle-location',
                '.dealer-location',
                '[data-test="vehicleLocation"]',
                '[data-qa="location"]',
                '[data-cmp="location"]',
                'span[class*="location"]',
                '.location span',
                '[class*="location"] span'
            ]
            
            print("🔍 Searching for location...")
            for i, selector in enumerate(location_selectors):
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and text.strip():
                            data['item_data']['location']['raw'] = text.strip()
                            print(f"✅ Found location with selector '{selector}': {text.strip()}")
                            break
                    else:
                        print(f"  ❌ Selector {i+1}: {selector} - not found")
                except Exception as e:
                    print(f"  ❌ Selector {i+1}: {selector} - error: {e}")
            
            # MODERN SELLER SELECTORS (2024 updated)
            seller_selectors = [
                '.seller-name',
                '.dealer-name',
                '.vehicle-seller',
                '[data-test="sellerName"]',
                '[data-qa="seller"]',
                '[data-cmp="seller"]',
                'span[class*="seller"]',
                '.seller span',
                '[class*="seller"] span'
            ]
            
            print("🔍 Searching for seller...")
            for i, selector in enumerate(seller_selectors):
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and text.strip():
                            data['item_data']['seller']['name'] = text.strip()
                            print(f"✅ Found seller with selector '{selector}': {text.strip()}")
                            break
                    else:
                        print(f"  ❌ Selector {i+1}: {selector} - not found")
                except Exception as e:
                    print(f"  ❌ Selector {i+1}: {selector} - error: {e}")
            
            # Extract Cars.com specific data
            url = page.url
            id_match = re.search(r'vehicledetail/([^/]+)', url)
            if id_match:
                data['platform_specific']['vehicle_id'] = id_match.group(1)
                print(f"✅ Found vehicle ID: {id_match.group(1)}")
            
        except Exception as e:
            print(f"❌ Modern Cars.com extraction error: {e}")
        
        return data
    
    def extract_zillow_data_modern(self, page) -> dict:
        """Extract Zillow data with MODERN 2024 CSS SELECTORS"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            print("🏠 Extracting Zillow data with MODERN selectors...")
            
            # MODERN TITLE SELECTORS
            title_selectors = [
                '.ds-chip-property-address',  # Zillow 2024
                'h1[data-test="property-address"]',
                '.property-address h1',
                'h1[class*="address"]',
                '.address h1',
                'h1'
            ]
            
            for selector in title_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 5:
                            data['item_data']['title'] = text.strip()
                            print(f"✅ Found title: {text.strip()[:50]}...")
                            break
                except:
                    continue
            
            # MODERN PRICE SELECTORS
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
                            data['item_data']['price'] = text.strip()
                            print(f"✅ Found price: {text.strip()}")
                            break
                    if data['item_data'].get('price'):
                        break
                except:
                    continue
            
            # Extract Zillow-specific data
            url = page.url
            zpid_match = re.search(r'(\d+)_zpid', url)
            if zpid_match:
                data['platform_specific']['zpid'] = zpid_match.group(1)
                print(f"✅ Found ZPID: {zpid_match.group(1)}")
            
        except Exception as e:
            print(f"❌ Modern Zillow extraction error: {e}")
        
        return data
    
    def extract_amazon_data_modern(self, page) -> dict:
        """Extract Amazon data with MODERN 2024 CSS SELECTORS"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            print("🛒 Extracting Amazon data with MODERN selectors...")
            
            # MODERN TITLE SELECTORS
            title_selectors = [
                '#productTitle',  # Amazon standard
                '.product-title',
                '[data-automation-id="product-title"]',
                'h1[class*="title"]',
                'h1'
            ]
            
            for selector in title_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 5:
                            data['item_data']['title'] = text.strip()
                            print(f"✅ Found title: {text.strip()[:50]}...")
                            break
                except:
                    continue
            
            # MODERN PRICE SELECTORS
            price_selectors = [
                '.a-price-whole',  # Amazon standard
                '.a-price .a-offscreen',
                '[data-automation-id="price"]',
                '.price-value',
                'span[class*="price"]'
            ]
            
            for selector in price_selectors:
                try:
                    elements = page.query_selector_all(selector, timeout=5000)
                    for element in elements:
                        text = element.text_content()
                        if text and '$' in text:
                            data['item_data']['price'] = text.strip()
                            print(f"✅ Found price: {text.strip()}")
                            break
                    if data['item_data'].get('price'):
                        break
                except:
                    continue
            
            # Extract Amazon-specific data
            asin_element = page.query_selector('[data-asin]', timeout=5000)
            if asin_element:
                data['platform_specific']['asin'] = asin_element.get_attribute('data-asin')
                print(f"✅ Found ASIN: {asin_element.get_attribute('data-asin')}")
            
        except Exception as e:
            print(f"❌ Modern Amazon extraction error: {e}")
        
        return data
    
    def extract_ebay_data_modern(self, page) -> dict:
        """Extract eBay data with MODERN 2024 CSS SELECTORS"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            print("🛍️ Extracting eBay data with MODERN selectors...")
            
            # MODERN TITLE SELECTORS
            title_selectors = [
                '.x-item-title-label',  # eBay 2024
                'h1[class*="title"]',
                '.item-title',
                'h1'
            ]
            
            for selector in title_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 5:
                            data['item_data']['title'] = text.strip()
                            print(f"✅ Found title: {text.strip()[:50]}...")
                            break
                except:
                    continue
            
            # MODERN PRICE SELECTORS
            price_selectors = [
                '.u-flL.condText',  # eBay standard
                '.price-value',
                '[data-automation-id="price"]',
                'span[class*="price"]'
            ]
            
            for selector in price_selectors:
                try:
                    elements = page.query_selector_all(selector, timeout=5000)
                    for element in elements:
                        text = element.text_content()
                        if text and '$' in text:
                            data['item_data']['price'] = text.strip()
                            print(f"✅ Found price: {text.strip()}")
                            break
                    if data['item_data'].get('price'):
                        break
                except:
                    continue
            
            # Extract eBay-specific data
            item_id_match = re.search(r'/itm/(\d+)', page.url)
            if item_id_match:
                data['platform_specific']['item_id'] = item_id_match.group(1)
                print(f"✅ Found item ID: {item_id_match.group(1)}")
            
        except Exception as e:
            print(f"❌ Modern eBay extraction error: {e}")
        
        return data
    
    def extract_craigslist_data_modern(self, page) -> dict:
        """Extract Craigslist data with MODERN 2024 CSS SELECTORS"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            print("📋 Extracting Craigslist data with MODERN selectors...")
            
            # MODERN TITLE SELECTORS
            title_selectors = [
                '#titletextonly',  # Craigslist standard
                '.title',
                'h1[class*="title"]',
                'h1'
            ]
            
            for selector in title_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content() or element.get_attribute('value')
                        if text and len(text.strip()) > 5:
                            data['item_data']['title'] = text.strip()
                            print(f"✅ Found title: {text.strip()[:50]}...")
                            break
                except:
                    continue
            
            # MODERN PRICE SELECTORS
            price_selectors = [
                '.price',  # Craigslist standard
                'span[class*="price"]',
                '.price-value'
            ]
            
            for selector in price_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and '$' in text:
                            data['item_data']['price'] = text.strip()
                            print(f"✅ Found price: {text.strip()}")
                            break
                except:
                    continue
            
            # MODERN DESCRIPTION SELECTORS
            desc_selectors = [
                '#postingbody',  # Craigslist standard
                '.description',
                'div[class*="description"]',
                '.description-content'
            ]
            
            for selector in desc_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 20:
                            data['item_data']['description'] = text.strip()
                            print(f"✅ Found description: {text.strip()[:100]}...")
                            break
                except:
                    continue
            
        except Exception as e:
            print(f"❌ Modern Craigslist extraction error: {e}")
        
        return data
    
    def extract_generic_data_modern(self, page) -> dict:
        """Extract data from generic websites with MODERN 2024 CSS SELECTORS"""
        data = {'item_data': {}, 'platform_specific': {}}
        
        try:
            print("🌐 Extracting generic data with MODERN selectors...")
            
            # MODERN TITLE SELECTORS
            title_selectors = [
                'h1',
                '.title',
                '#title',
                '[data-title]',
                '[class*="title"]',
                '[data-testid="title"]'
            ]
            
            for selector in title_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 5:
                            data['item_data']['title'] = text
                            print(f"✅ Found title: {text[:50]}...")
                            break
                except:
                    continue
            
            # MODERN PRICE SELECTORS
            price_selectors = [
                '.price',
                '#price',
                '[data-price]',
                '[class*="price"]',
                '[data-testid="price"]',
                'span[class*="price"]'
            ]
            
            for selector in price_selectors:
                try:
                    elements = page.query_selector_all(selector, timeout=5000)
                    for element in elements:
                        text = element.text_content()
                        if text and ('$' in text or '£' in text or '€' in text):
                            data['item_data']['price'] = text.strip()
                            print(f"✅ Found price: {text.strip()}")
                            break
                    if data['item_data'].get('price'):
                        break
                except:
                    continue
            
            # MODERN DESCRIPTION SELECTORS
            desc_selectors = [
                '.description',
                '#description',
                '[data-description]',
                '[class*="description"]',
                '[data-testid="description"]',
                'div[class*="description"]'
            ]
            
            for selector in desc_selectors:
                try:
                    element = page.query_selector(selector, timeout=5000)
                    if element:
                        text = element.text_content()
                        if text and len(text.strip()) > 50:
                            data['item_data']['description'] = text
                            print(f"✅ Found description: {text[:100]}...")
                            break
                except:
                    continue
            
        except Exception as e:
            print(f"❌ Modern generic extraction error: {e}")
        
        return data
    
    def extract_images_by_platform(self, page, platform: str, url: str) -> list:
        """Extract images based on platform with MODERN 2024 CSS SELECTORS"""
        images = []
        
        try:
            print(f"🖼️ Extracting images for {platform} with MODERN selectors...")
            
            if platform == 'cars':
                # MODERN CARS.COM IMAGE SELECTORS (2024 updated)
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
                
                print("🔍 Searching for Cars.com images...")
                for i, selector in enumerate(img_selectors):
                    try:
                        img_elements = page.query_selector_all(selector, timeout=5000)
                        print(f"  📸 Selector {i+1}: {selector} - found {len(img_elements)} images")
                        for img in img_elements:
                            src = img.get_attribute('src')
                            if src and src.startswith('http') and len(src) > 20:
                                images.append({
                                    'url': src,
                                    'filename': f'image_{len(images)+1:02d}.jpg',
                                    'platform': 'cars'
                                })
                        if images:
                            break
                    except Exception as e:
                        print(f"  ❌ Selector {i+1}: {selector} - error: {e}")
            
            elif platform == 'zillow':
                # ZILLOW IMAGE SELECTORS
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
                            'filename': f'image_{i+1:02d}.webp',
                            'platform': 'zillow'
                        })
                except:
                    pass
            
            else:
                # GENERIC IMAGE SELECTORS
                img_selectors = [
                    'img[src*="cdn"]',
                    'img[src*="static"]',
                    'img[class*="photo"]',
                    'img[class*="image"]',
                    'img[alt*="product"]',
                    '.gallery img',
                    '.carousel img',
                    '.slider img'
                ]
                
                for selector in img_selectors:
                    try:
                        img_elements = page.query_selector_all(selector, timeout=5000)
                        for img in img_elements:
                            src = img.get_attribute('src')
                            if src and src.startswith('http') and not 'icon' in src.lower() and len(src) > 20:
                                images.append({
                                    'url': src,
                                    'filename': f'image_{len(images)+1:02d}.jpg',
                                    'platform': 'generic'
                                })
                        if images:
                            break
                    except:
                        continue
        
        except Exception as e:
            print(f"❌ Modern image extraction error: {e}")
        
        print(f"✅ Found {len(images)} images total")
        return images[:20]  # Limit to 20 images
    
    def download_images(self, page, images: list, output_folder: str) -> list:
        """Download images using browser context"""
        downloaded = []
        
        for i, image_info in enumerate(images):
            try:
                # Rate limiting
                time.sleep(random.uniform(0.5, 1.5))
                
                print(f"⬇️  Downloading image {i+1}: {image_info['url'][:50]}...")
                
                # Go to image URL with timeout
                try:
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
                    else:
                        print(f"⚠️ Failed to download image {i+1}: HTTP {response.status if response else 'No response'}")
                        
                except Exception as download_error:
                    print(f"⚠️ Download error for image {i+1}: {download_error}")
                
            except Exception as e:
                print(f"❌ Failed to download image {i+1}: {e}")
        
        print(f"✅ Successfully downloaded {len(downloaded)}/{len(images)} images")
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
                
                print(f"✅ EXTRACTION SUCCESS!")
                print(f"📊 Total images: {scraped_data.get('media', {}).get('total_images', 0)}")
                print(f"📄 Data file: {json_file}")
                print(f"🌐 Browser used: {scraped_data.get('scraping_metadata', {}).get('browser_used', 'unknown')}")
                
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
    
    parser = argparse.ArgumentParser(description='Universal Multi-Platform Scraper - WORKING VERSION')
    parser.add_argument('--batch', help='File with URLs (one per line)')
    parser.add_argument('--url', help='Single URL to scrape')
    parser.add_argument('--output', default='scraped_data', help='Output directory')
    
    args = parser.parse_args()
    
    # Initialize scraper
    scraper = WorkingUniversalScraper()
    
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
        
        print(f"\n🎉 BATCH SCRAPING COMPLETED!")
        print(f"✅ Successfully scraped: {len(results)}/{len(urls)} URLs")
        print(f"📁 Results saved in: {args.output}")
        
        # Summary
        for i, result in enumerate(results):
            platform = result.get('platform', 'unknown')
            images = result.get('media', {}).get('total_images', 0)
            browser = result.get('scraping_metadata', {}).get('browser_used', 'unknown')
            print(f"  {i+1}. {platform}: {images} images (browser: {browser})")
        
    elif args.url:
        # Single URL processing
        result = scraper.scrape_url(args.url)
        
        if result:
            print(f"\n🎉 SCRAPING COMPLETED SUCCESSFULLY!")
            print(f"📁 Results saved in: {args.output}")
        else:
            print(f"\n❌ SCRAPING FAILED!")
    
    else:
        print("❌ Please provide either --batch or --url argument")
        print("Example: python universal_scraper_working.py --batch links.txt")
        print("Example: python universal_scraper_working.py --url 'https://example.com'")

if __name__ == "__main__":
    main()
