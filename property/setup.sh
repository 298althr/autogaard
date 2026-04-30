#!/bin/bash

# Universal Scraper Quick Setup Script
# Run this script to set up the universal scraper in 5 minutes

echo "🚀 Universal Scraper Setup"
echo "=========================="

# Check Python version
echo "📋 Checking Python version..."
python_version=$(python3 --version 2>&1 | grep -oP '\d+\.\d+' | head -1)
required_version="3.8"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" = "$required_version" ]; then
    echo "✅ Python $python_version detected (>= 3.8)"
else
    echo "❌ Python $python_version detected (>= 3.8 required)"
    echo "Please install Python 3.8+ first"
    exit 1
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv universal_scraper_env
source universal_scraper_env/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
playwright install chromium firefox webkit

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p scraped_data
mkdir -p logs
mkdir -p config

# Copy configuration
echo "⚙️  Setting up configuration..."
cp config.yaml config/production.yaml

# Test installation
echo "🧪 Testing installation..."
python -c "
try:
    from playwright.sync_api import sync_playwright
    from bs4 import BeautifulSoup
    import requests
    print('✅ All dependencies installed successfully!')
except ImportError as e:
    print(f'❌ Import error: {e}')
    exit(1)
"

# Create test script
echo "📝 Creating test script..."
cat > test_scraper.py << 'EOF'
#!/usr/bin/env python3

from universal_scraper import UniversalScraper

def test_scraper():
    print("🧪 Testing Universal Scraper...")
    
    # Test URLs
    test_urls = [
        "https://www.zillow.com/homedetails/330-Las-Colinas-Blvd-924-Irving-TX-75039/67968866_zpid/",
        "https://www.amazon.com/dp/B08N5WRWNW",
        "https://www.cars.com/for-sale/used-cars/"
    ]
    
    scraper = UniversalScraper()
    
    for url in test_urls:
        print(f"\n🌐 Testing: {url}")
        result = scraper.scrape_url(url)
        
        if result:
            print(f"✅ Success! Platform: {result.get('platform', 'unknown')}")
            print(f"📸 Images: {result.get('media', {}).get('total_images', 0)}")
            print(f"📄 Data saved to: {result.get('output_folder', 'unknown')}")
        else:
            print("❌ Failed")

if __name__ == "__main__":
    test_scraper()
EOF

chmod +x test_scraper.py

# Create usage examples
echo "📚 Creating usage examples..."
cat > USAGE_EXAMPLES.md << 'EOF'
# Universal Scraper Usage Examples

## Quick Start
```bash
# Activate virtual environment
source universal_scraper_env/bin/activate

# Scrape single URL
python universal_scraper.py --url "https://example.com/listing"

# Scrape multiple URLs
python universal_scraper.py --batch urls.txt

# Custom output directory
python universal_scraper.py --url "https://example.com/listing" --output "my_data"
```

## Python API
```python
from universal_scraper import UniversalScraper

# Initialize scraper
scraper = UniversalScraper()

# Scrape single URL
result = scraper.scrape_url("https://example.com/listing")

# Scrape multiple URLs
urls = ["url1", "url2", "url3"]
results = scraper.scrape_batch(urls)
```

## Configuration
```python
config = {
    "rate_limiting": {"delay_min": 3, "delay_max": 6},
    "browser_settings": {"headless": True, "stealth": True},
    "output": {"base_dir": "my_scraped_data"}
}

scraper = UniversalScraper(config)
```

## Supported Platforms
- ✅ Zillow (Real Estate)
- ✅ Amazon (E-commerce)
- ✅ Cars.com (Automotive)
- ✅ eBay (Marketplace)
- ✅ Craigslist (Classifieds)
- ✅ Generic (Any website)
EOF

echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next Steps:"
echo "1. Activate environment: source universal_scraper_env/bin/activate"
echo "2. Test scraper: python test_scraper.py"
echo "3. Scrape your first URL: python universal_scraper.py --url 'YOUR_URL_HERE'"
echo "4. Check results in: scraped_data/"
echo ""
echo "📚 For more examples, see: USAGE_EXAMPLES.md"
echo "📖 For documentation, see: UNIVERSAL_SCRAPER_SKILLS.md"
