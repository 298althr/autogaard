import uuid
import json
import os
import time
import re
import requests
from datetime import datetime
from urllib.parse import urlparse

class ZillowHTTPScraper:
    def __init__(self, output_base_dir="property"):
        self.output_base_dir = output_base_dir
        self.session = requests.Session()
        
        # Enhanced headers to avoid blocking
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.zillow.com/',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"'
        })
        
    def generate_unique_id(self):
        return str(uuid.uuid4())[:8]
    
    def create_output_folder(self, unique_id, zpid):
        folder_name = f"{unique_id}_zpid_{zpid}"
        output_folder = os.path.join(self.output_base_dir, folder_name)
        os.makedirs(output_folder, exist_ok=True)
        return output_folder
    
    def extract_zpid_from_url(self, url):
        """Extract ZPID from URL"""
        zpid_match = re.search(r'(\d+)_zpid', url)
        return zpid_match.group(1) if zpid_match else None
    
    def fetch_property_html(self, property_url):
        """Fetch property HTML with rate limiting"""
        try:
            print(f"📡 Fetching property page HTML...")
            print(f"🌐 URL: {property_url}")
            
            # Add delay to respect rate limits
            time.sleep(2)
            
            response = self.session.get(property_url, timeout=30)
            response.raise_for_status()
            
            print(f"✅ Successfully fetched HTML ({len(response.text)} characters)")
            return response.text
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Network error: {e}")
            return None
        except Exception as e:
            print(f"❌ Error fetching HTML: {e}")
            return None
    
    def extract_property_data_from_html(self, html_content, property_url, zpid):
        """Extract all property data from HTML content"""
        
        property_data = {
            'basicInfo': {
                'address': None,
                'price': None,
                'beds': None,
                'baths': None,
                'sqft': None,
                'yearBuilt': None,
                'hoaFee': None,
                'pricePerSqft': None,
                'propertyType': None,
                'daysOnZillow': None,
                'views': None,
                'saves': None
            },
            'financial': {
                'listPrice': None,
                'zestimate': None,
                'estimatedPayment': None,
                'priceCut': None
            },
            'details': {
                'description': None,
                'specialFeatures': [],
                'whatsSpecial': []
            },
            'location': {
                'city': None,
                'state': None,
                'zipCode': None
            },
            'listing': {
                'listingId': zpid,
                'mlsId': None
            },
            'photos': {
                'totalPhotos': None,
                'photoUrls': [],
                'downloadedPhotos': []
            },
            'extractionTimestamp': datetime.now().isoformat(),
            'sourceUrl': property_url
        }
        
        # Extract address from title and HTML patterns
        address_patterns = [
            r'<title[^>]*>([^<]+)</title>',
            r'"address":"([^"]+)"',
            r'"streetAddress":"([^"]+)"',
            r'<h1[^>]*>([^<]+)</h1>'
        ]
        
        for pattern in address_patterns:
            matches = re.findall(pattern, html_content, re.IGNORECASE)
            for match in matches:
                clean_address = re.sub(r'<[^>]+>', '', match).strip()
                if ',' in clean_address and any(char.isdigit() for char in clean_address) and 'zillow' not in clean_address.lower():
                    property_data['basicInfo']['address'] = clean_address
                    break
            if property_data['basicInfo']['address']:
                break
        
        # Extract price
        price_patterns = [
            r'"price":(\d+)',
            r'"listPrice":(\d+)',
            r'"price":{"value":(\d+)}',
            r'"price":\{"value":(\d+)}',
            r'\$(\d{3},\d{3})',
            r'"price":"\$?([\d,]+)"'
        ]
        
        for pattern in price_patterns:
            matches = re.findall(pattern, html_content)
            for match in matches:
                price_value = str(match).replace(',', '')
                if price_value.isdigit() and int(price_value) > 10000:
                    property_data['basicInfo']['price'] = f"${int(price_value):,}"
                    property_data['financial']['listPrice'] = f"${int(price_value):,}"
                    break
            if property_data['basicInfo']['price']:
                break
        
        # Extract bedrooms
        bed_patterns = [
            r'"bedrooms":(\d+)',
            r'"numBeds":(\d+)',
            r'"bedroomCount":(\d+)',
            r'"beds":(\d+)',
            r'(\d+)\s*beds?'
        ]
        
        for pattern in bed_patterns:
            matches = re.findall(pattern, html_content, re.IGNORECASE)
            for match in matches:
                if str(match).isdigit() and 0 < int(match) < 20:
                    property_data['basicInfo']['beds'] = f"{match} beds"
                    break
            if property_data['basicInfo']['beds']:
                break
        
        # Extract bathrooms
        bath_patterns = [
            r'"bathrooms":([\d.]+)',
            r'"numBaths":([\d.]+)',
            r'"bathroomCount":([\d.]+)',
            r'"baths":([\d.]+)',
            r'(\d+(?:\.\d+)?)\s*baths?'
        ]
        
        for pattern in bath_patterns:
            matches = re.findall(pattern, html_content, re.IGNORECASE)
            for match in matches:
                try:
                    bath_value = float(match)
                    if 0 < bath_value < 20:
                        property_data['basicInfo']['baths'] = f"{bath_value} baths"
                        break
                except ValueError:
                    continue
            if property_data['basicInfo']['baths']:
                break
        
        # Extract square footage
        sqft_patterns = [
            r'"livingArea":(\d+)',
            r'"area":(\d+)',
            r'"sqft":(\d+)',
            r'"size":(\d+)',
            r'(\d{3,4})\s*sqft'
        ]
        
        for pattern in sqft_patterns:
            matches = re.findall(pattern, html_content, re.IGNORECASE)
            for match in matches:
                if str(match).isdigit() and 100 < int(match) < 10000:
                    property_data['basicInfo']['sqft'] = f"{int(match):,} sqft"
                    break
            if property_data['basicInfo']['sqft']:
                break
        
        # Extract year built
        year_patterns = [
            r'"yearBuilt":(\d{4})',
            r'"built":(\d{4})',
            r'built in (\d{4})',
            r'"constructionYear":(\d{4})'
        ]
        
        for pattern in year_patterns:
            matches = re.findall(pattern, html_content)
            for match in matches:
                if match.isdigit() and 1900 < int(match) <= datetime.now().year:
                    property_data['basicInfo']['yearBuilt'] = match
                    break
            if property_data['basicInfo']['yearBuilt']:
                break
        
        # Extract property type
        type_patterns = [
            r'"propertyType":"([^"]+)"',
            r'"homeType":"([^"]+)"',
            r'"type":"([^"]+)"',
            r'Condominium|Single Family|Multi Family|Townhouse|Apartment'
        ]
        
        for pattern in type_patterns:
            if 'Condominium' in pattern or 'Single Family' in pattern:
                matches = re.findall(pattern, html_content, re.IGNORECASE)
                for match in matches:
                    if match and len(match) > 3:
                        property_data['basicInfo']['propertyType'] = match.strip()
                        break
            else:
                matches = re.findall(pattern, html_content, re.IGNORECASE)
                for match in matches:
                    if match and len(match) > 3 and 'zillow' not in match.lower():
                        property_data['basicInfo']['propertyType'] = match.strip('"')
                        break
            if property_data['basicInfo']['propertyType']:
                break
        
        # Extract description
        desc_patterns = [
            r'"description":"([^"]{100,})"',
            r'"summary":"([^"]{100,})"',
            r'"remarks":"([^"]{100,})"',
            r'<meta[^>]*name="description"[^>]*content="([^"]{100,})"'
        ]
        
        for pattern in desc_patterns:
            matches = re.findall(pattern, html_content, re.DOTALL | re.IGNORECASE)
            for match in matches:
                clean_desc = re.sub(r'\\n', ' ', match).strip()
                if len(clean_desc) > 50 and 'zillow' not in clean_desc.lower():
                    property_data['details']['description'] = clean_desc[:500] + "..." if len(clean_desc) > 500 else clean_desc
                    break
            if property_data['details']['description']:
                break
        
        # Extract "What's special" features
        special_patterns = [
            r'"specialFeatures":\s*\[([^\]]+)\]',
            r'"amenities":\s*\[([^\]]+)\]',
            r'"features":\s*\[([^\]]+)\]',
            r'"whatsSpecial":\s*\[([^\]]+)\]'
        ]
        
        for pattern in special_patterns:
            matches = re.findall(pattern, html_content, re.IGNORECASE)
            for match in matches:
                # Parse JSON-like array
                features = re.findall(r'"([^"]+)"', match)
                for feature in features:
                    if feature and len(feature) > 2:
                        property_data['details']['whatsSpecial'].append(feature.strip())
                        property_data['details']['specialFeatures'].append(feature.strip())
                if property_data['details']['whatsSpecial']:
                    break
            if property_data['details']['whatsSpecial']:
                break
        
        # Extract Zestimate
        zestimate_patterns = [
            r'"zestimate":(\d+)',
            r'"zestimateAmount":(\d+)',
            r'"zestimate":{"value":(\d+)}'
        ]
        
        for pattern in zestimate_patterns:
            matches = re.findall(pattern, html_content)
            for match in matches:
                if match.isdigit() and int(match) > 10000:
                    property_data['financial']['zestimate'] = f"${int(match):,}"
                    break
            if property_data['financial']['zestimate']:
                break
        
        # Extract photo URLs
        photo_patterns = [
            r'https://photos\.zillowstatic\.com/fp/[^\s"\'<>]+',
            r'"photoUrl":"([^"]+)"',
            r'"image":"([^"]+)"',
            r'"url":"([^"]*zillowstatic[^"]*)"'
        ]
        
        all_photo_urls = []
        for pattern in photo_patterns:
            matches = re.findall(pattern, html_content)
            for match in matches:
                if match and 'zillowstatic.com' in match:
                    all_photo_urls.append(match)
        
        # Remove duplicates and get unique URLs
        unique_photo_urls = list(set(all_photo_urls))
        property_data['photos']['photoUrls'] = unique_photo_urls
        property_data['photos']['totalPhotos'] = len(unique_photo_urls)
        
        # Extract MLS ID
        mls_patterns = [
            r'"mlsId":"([^"]+)"',
            r'"listingId":"([^"]+)"',
            r'MLS[_%20]+(\d+)',
            r'"mlsNumber":"([^"]+)"'
        ]
        
        for pattern in mls_patterns:
            matches = re.findall(pattern, html_content, re.IGNORECASE)
            for match in matches:
                if match and match.isdigit():
                    property_data['listing']['mlsId'] = match
                    break
            if property_data['listing']['mlsId']:
                break
        
        # Parse address components
        if property_data['basicInfo']['address']:
            address_parts = property_data['basicInfo']['address'].split(',')
            if len(address_parts) >= 3:
                property_data['location']['city'] = address_parts[1].strip()
                state_zip = address_parts[2].strip()
                if state_zip:
                    state_zip_parts = state_zip.split(' ')
                    property_data['location']['state'] = state_zip_parts[0]
                    property_data['location']['zipCode'] = ' '.join(state_zip_parts[1:])
        
        return property_data
    
    def download_photos_http(self, photo_urls, output_folder):
        """Download photos using HTTP requests with rate limiting"""
        downloaded_photos = []
        
        print(f"📸 Downloading {len(photo_urls)} photos...")
        
        for i, url in enumerate(photo_urls[:20]):  # Limit to 20 photos
            try:
                # Rate limiting - add delay
                time.sleep(1)
                
                # Get highest quality version
                if '-unc.jpg' not in url and '-p_f.jpg' not in url:
                    if url.endswith('.jpg'):
                        url = url.replace('.jpg', '-unc.jpg')
                
                print(f"⬇️  Downloading photo {i+1}: {url[:50]}...")
                
                # Download with enhanced headers
                response = self.session.get(url, timeout=15)
                response.raise_for_status()
                
                # Determine file extension
                parsed_url = urlparse(url)
                path = parsed_url.path
                if '.' in path:
                    ext = path.split('.')[-1]
                    ext = re.sub(r'[^\w]', '', ext)
                    if len(ext) > 4:
                        ext = 'webp'
                else:
                    ext = 'webp'
                
                # Save image
                filename = f"main_photo_{i+1:02d}.{ext}"
                filepath = os.path.join(output_folder, filename)
                
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                downloaded_photos.append({
                    'filename': filename,
                    'url': url,
                    'filepath': filepath
                })
                
                print(f"✅ Successfully downloaded: {filename}")
                
            except Exception as e:
                print(f"❌ Failed to download photo {i+1}: {e}")
        
        print(f"📸 Downloaded {len(downloaded_photos)}/{len(photo_urls)} photos")
        return downloaded_photos
    
    def save_complete_data(self, property_data, output_folder):
        """Save complete property data as JSON"""
        json_file = os.path.join(output_folder, "complete_property_data.json")
        
        try:
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(property_data, f, indent=2, ensure_ascii=False)
            
            print(f"📄 Complete property data saved to: {json_file}")
            return json_file
            
        except Exception as e:
            print(f"❌ Failed to save property data: {e}")
            return None
    
    def scrape_complete_property_http(self, property_url):
        """Complete pipeline using HTTP requests only"""
        print(f"🏠 Starting HTTP-based Zillow scraper")
        print(f"🌐 Property URL: {property_url}")
        print("=" * 60)
        
        # Extract ZPID from URL
        zpid = self.extract_zpid_from_url(property_url)
        if not zpid:
            print("❌ Could not extract ZPID from URL")
            return None
        
        # Generate unique ID and create folder
        unique_id = self.generate_unique_id()
        output_folder = self.create_output_folder(unique_id, zpid)
        print(f"📁 Output folder: {output_folder}")
        print(f"🆔 Unique ID: {unique_id}")
        print(f"🏷️  ZPID: {zpid}")
        
        # Fetch HTML content
        html_content = self.fetch_property_html(property_url)
        if not html_content:
            return {
                'unique_id': unique_id,
                'zpid': zpid,
                'property_url': property_url,
                'output_folder': output_folder,
                'data_extraction_successful': False,
                'error': 'Failed to fetch HTML content',
                'extraction_timestamp': datetime.now().isoformat()
            }
        
        # Extract property data
        print("🔍 Extracting property data from HTML...")
        property_data = self.extract_property_data_from_html(html_content, property_url, zpid)
        
        if property_data:
            print(f"✅ Property data extracted successfully")
            
            # Download photos
            if property_data['photos']['photoUrls']:
                downloaded_photos = self.download_photos_http(property_data['photos']['photoUrls'], output_folder)
                property_data['photos']['downloadedPhotos'] = downloaded_photos
            
            # Save complete data
            json_file = self.save_complete_data(property_data, output_folder)
            
            # Generate summary
            summary = {
                'unique_id': unique_id,
                'zpid': zpid,
                'property_url': property_url,
                'output_folder': output_folder,
                'data_extraction_successful': True,
                'json_file': json_file,
                'photos_downloaded': len(downloaded_photos) if 'downloaded_photos' in locals() else 0,
                'extraction_timestamp': datetime.now().isoformat()
            }
            
            print("=" * 60)
            print("📊 HTTP-BASED PROPERTY DATA SUMMARY")
            print("=" * 60)
            print(f"🆔 Unique ID: {summary['unique_id']}")
            print(f"🏠 Address: {property_data.get('basicInfo', {}).get('address', 'N/A')}")
            print(f"💰 Price: {property_data.get('basicInfo', {}).get('price', 'N/A')}")
            print(f"🛏️  Beds: {property_data.get('basicInfo', {}).get('beds', 'N/A')}")
            print(f"🚿 Baths: {property_data.get('basicInfo', {}).get('baths', 'N/A')}")
            print(f"📐 Sqft: {property_data.get('basicInfo', {}).get('sqft', 'N/A')}")
            print(f"📅 Year Built: {property_data.get('basicInfo', {}).get('yearBuilt', 'N/A')}")
            print(f"📸 Total Photos: {property_data.get('photos', {}).get('totalPhotos', 'N/A')}")
            print(f"📸 Downloaded Photos: {summary.get('photos_downloaded', 0)}")
            print(f"⭐ What's Special: {len(property_data.get('details', {}).get('whatsSpecial', []))} features")
            print(f"📄 Data saved to: {json_file}")
            print("=" * 60)
            
            return summary
        else:
            print("❌ Failed to extract property data")
            return {
                'unique_id': unique_id,
                'zpid': zpid,
                'property_url': property_url,
                'output_folder': output_folder,
                'data_extraction_successful': False,
                'error': 'Failed to extract property data from HTML',
                'extraction_timestamp': datetime.now().isoformat()
            }

def main():
    """Test HTTP-based scraper with new link"""
    scraper = ZillowHTTPScraper()
    
    # Test with the new link
    property_url = "https://www.zillow.com/homedetails/330-Las-Colinas-Blvd-APT-174-Irving-TX-75039/67968726_zpid/"
    
    print("🚀 TESTING HTTP-BASED SCRAPER")
    print("=" * 60)
    print(f"🌐 Test URL: {property_url}")
    print(f"⏱️  Rate Limit: 2 seconds between requests")
    print(f"📡 HTTP Timeout: 30 seconds")
    print(f"🖼️  Photo Download Delay: 1 second between photos")
    print("=" * 60)
    
    results = scraper.scrape_complete_property_http(property_url)
    
    if results and results.get('data_extraction_successful'):
        print(f"\n🎉 HTTP-based scraping completed successfully!")
        print(f"📄 Data saved to: {results.get('json_file')}")
        print(f"📸 Photos downloaded: {results.get('photos_downloaded', 0)}")
    else:
        print(f"\n❌ HTTP-based scraping failed!")
        if results:
            print(f"Error: {results.get('error', 'Unknown error')}")

if __name__ == "__main__":
    main()
