# Browser Automation Integration for Zillow Scraper

## Playwright Implementation

```python
from playwright.sync_api import sync_playwright

class ZillowBrowserExtractor:
    def __init__(self):
        self.playwright = None
        self.browser = None
        self.page = None
    
    def start_browser(self):
        """Start Playwright browser with stealth settings"""
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(
            headless=True,  # Set to False for debugging
            args=[
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--no-sandbox'
            ]
        )
        
        context = self.browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport={'width': 1920, 'height': 1080}
        )
        
        self.page = context.new_page()
    
    def extract_photo_data(self, property_url):
        """Extract photo URLs and IDs from Zillow property page"""
        
        # Navigate to property page
        self.page.goto(property_url)
        self.page.wait_for_timeout(3000)
        
        # Try to click "See all photos" if present
        try:
            see_all_button = self.page.locator('button[data-testid="gallery-see-all-photos-button"]').first
            if see_all_button.is_visible():
                see_all_button.click()
                self.page.wait_for_timeout(2000)
        except:
            pass
        
        # Extract photo URLs from script tags
        scripts = self.page.eval_on_selector_all('script', '''
            scripts => scripts
                .map(script => script.textContent)
                .filter(content => content && content.includes('photos.zillowstatic.com'))
        ''')
        
        # Extract URLs using regex
        photo_urls = []
        for script in scripts:
            matches = re.findall(r'https://photos\.zillowstatic\.com/fp/[^\s"\'\)]+', script)
            photo_urls.extend(matches)
        
        # Clean and deduplicate
        clean_urls = [url.rstrip('\\') for url in photo_urls]
        unique_urls = list(set(clean_urls))
        
        # Extract unique photo IDs
        photo_ids = set()
        for url in unique_urls:
            match = re.search(r'/fp/([a-f0-9]+)-', url)
            if match:
                photo_ids.add(match.group(1))
        
        return {
            'total_urls': len(unique_urls),
            'unique_photo_ids': list(photo_ids),
            'all_urls': unique_urls
        }
    
    def close_browser(self):
        """Clean up browser resources"""
        if self.page:
            self.page.close()
        if self.browser:
            self.browser.close()
        if self.playwright:
            self.playwright.stop()
```

## Selenium Implementation

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

class ZillowSeleniumExtractor:
    def __init__(self):
        self.driver = None
    
    def start_browser(self):
        """Start Selenium browser with stealth settings"""
        options = Options()
        options.add_argument('--disable-blink-features=AutomationControlled')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
        
        self.driver = webdriver.Chrome(options=options)
        self.driver.set_window_size(1920, 1080)
    
    def extract_photo_data(self, property_url):
        """Extract photo URLs and IDs from Zillow property page"""
        
        # Navigate to property page
        self.driver.get(property_url)
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        # Try to click "See all photos" if present
        try:
            see_all_button = WebDriverWait(self.driver, 5).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-testid="gallery-see-all-photos-button"]'))
            )
            see_all_button.click()
            time.sleep(2)
        except:
            pass
        
        # Extract photo URLs from script tags
        scripts = self.driver.execute_script('''
            return Array.from(document.querySelectorAll('script'))
                .map(script => script.textContent)
                .filter(content => content && content.includes('photos.zillowstatic.com'));
        ''')
        
        # Extract URLs using regex
        photo_urls = []
        for script in scripts:
            matches = re.findall(r'https://photos\.zillowstatic\.com/fp/[^\s"\'\)]+', script)
            photo_urls.extend(matches)
        
        # Clean and deduplicate
        clean_urls = [url.rstrip('\\') for url in photo_urls]
        unique_urls = list(set(clean_urls))
        
        # Extract unique photo IDs
        photo_ids = set()
        for url in unique_urls:
            match = re.search(r'/fp/([a-f0-9]+)-', url)
            if match:
                photo_ids.add(match.group(1))
        
        return {
            'total_urls': len(unique_urls),
            'unique_photo_ids': list(photo_ids),
            'all_urls': unique_urls
        }
    
    def close_browser(self):
        """Clean up browser resources"""
        if self.driver:
            self.driver.quit()
```

## Integration with Main Scraper

```python
# Update the extract_photo_data_from_browser method in zillow_photo_scraper_tool.py

def extract_photo_data_from_browser(self, property_url, zpid):
    """Extract photo URLs and IDs using browser automation"""
    
    # Choose your preferred browser automation method
    extractor = ZillowBrowserExtractor()  # or ZillowSeleniumExtractor()
    
    try:
        extractor.start_browser()
        photo_data = extractor.extract_photo_data(property_url)
        return photo_data
    finally:
        extractor.close_browser()
```

## Installation Requirements

### For Playwright:
```bash
pip install playwright
playwright install chromium
```

### For Selenium:
```bash
pip install selenium
# Download ChromeDriver matching your Chrome version
```

## Usage Example

```python
# Complete workflow with browser automation
scraper = ZillowPhotoScraper()
results = scraper.scrape_property(property_url, zpid)
```
