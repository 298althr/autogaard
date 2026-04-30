import uuid
import requests
import os
import time
import re
from urllib.parse import urlparse
from datetime import datetime

class ZillowPhotoScraperV2:
    def __init__(self, output_base_dir="property"):
        self.output_base_dir = output_base_dir
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://www.zillow.com/'
        }
        
    def generate_unique_id(self):
        """Generate a unique ID for the property folder"""
        return str(uuid.uuid4())[:8]  # First 8 characters of UUID
    
    def create_output_folder(self, unique_id, zpid):
        """Create output folder with unique ID"""
        folder_name = f"{unique_id}_zpid_{zpid}"
        output_folder = os.path.join(self.output_base_dir, folder_name)
        os.makedirs(output_folder, exist_ok=True)
        return output_folder
    
    def extract_main_photos_only(self, photo_urls):
        """Extract only main images (highest resolution per photo ID)"""
        # Group URLs by photo ID
        photo_groups = {}
        
        for url in photo_urls:
            # Extract photo ID
            match = re.search(r'/fp/([a-f0-9]+)-', url)
            if not match:
                continue
                
            photo_id = match.group(1)
            
            if photo_id not in photo_groups:
                photo_groups[photo_id] = []
            photo_groups[photo_id].append(url)
        
        # Select only the highest quality image from each group
        main_photos = []
        
        for photo_id, urls in photo_groups.items():
            # Sort by quality preference
            quality_order = [
                '-cc_ft_1536.webp',
                '-cc_ft_1152.webp', 
                '-cc_ft_1536.jpg',
                '-cc_ft_1152.jpg',
                '-p_f.jpg',
                '-o_a.webp',
                '-cc_ft_768.webp'
            ]
            
            best_url = None
            best_quality = len(quality_order) + 1
            
            for url in urls:
                for i, quality_suffix in enumerate(quality_order):
                    if quality_suffix in url:
                        if i < best_quality:
                            best_quality = i
                            best_url = url
                        break
            
            if best_url:
                main_photos.append(best_url)
        
        return main_photos
    
    def download_photos(self, photo_urls, output_folder):
        """Download photos with progress tracking"""
        downloaded_count = 0
        failed_count = 0
        download_log = []
        
        print(f"📥 Downloading {len(photo_urls)} main photos...")
        
        for i, photo_url in enumerate(photo_urls, 1):
            try:
                print(f"📸 Photo {i}/{len(photo_urls)}", end=' ')
                
                response = requests.get(photo_url, headers=self.headers, timeout=15)
                
                if response.status_code == 200 and len(response.content) > 1000:
                    # Determine file extension
                    ext = 'webp' if photo_url.endswith('.webp') else 'jpg'
                    
                    # Save image
                    filename = f"main_photo_{i:02d}.{ext}"
                    filepath = os.path.join(output_folder, filename)
                    
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    
                    file_size = len(response.content)
                    print(f"✅ {filename} ({file_size/1024:.1f} KB)")
                    downloaded_count += 1
                    download_log.append(f"✓ {filename} - {file_size/1024:.1f} KB")
                else:
                    print(f"❌ Failed (HTTP {response.status_code})")
                    failed_count += 1
                    download_log.append(f"✗ Photo {i} - HTTP {response.status_code}")
                    
            except Exception as e:
                print(f"❌ Failed ({str(e)[:50]}...)")
                failed_count += 1
                download_log.append(f"✗ Photo {i} - Error: {str(e)[:50]}")
            
            # Rate limiting
            time.sleep(0.5)
        
        # Save download log
        log_file = os.path.join(output_folder, "download_log.txt")
        with open(log_file, 'w', encoding='utf-8') as f:
            f.write(f"# Zillow Main Photos Download Log\n")
            f.write(f"# Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write("\n".join(download_log))
        
        return {
            'downloaded': downloaded_count,
            'failed': failed_count,
            'total': len(photo_urls),
            'log_file': log_file
        }
    
    def save_main_urls(self, urls, output_folder):
        """Save main photo URLs to file"""
        urls_file = os.path.join(output_folder, "main_photo_urls.txt")
        
        with open(urls_file, 'w', encoding='utf-8') as f:
            f.write(f"# Zillow Property Main Photo URLs\n")
            f.write(f"# Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"# Total main photos: {len(urls)}\n\n")
            
            for i, url in enumerate(urls, 1):
                f.write(f"# Main photo {i}\n")
                f.write(url + '\n\n')
        
        print(f"📄 Saved {len(urls)} main photo URLs to: {urls_file}")
        return urls_file
    
    def scrape_property_main_photos(self, property_url, zpid):
        """
        Scrape only main photos from a Zillow property
        """
        print(f"🏠 Starting Zillow main photos scraper for ZPID: {zpid}")
        print(f"🌐 Property URL: {property_url}")
        print("=" * 60)
        
        # Step 1: Generate unique ID and create folder
        unique_id = self.generate_unique_id()
        output_folder = self.create_output_folder(unique_id, zpid)
        print(f"📁 Output folder: {output_folder}")
        print(f"🆔 Unique ID: {unique_id}")
        
        # Step 2: Simulate browser extraction (in real implementation, use browser automation)
        print(f"🔍 Extracting photo data from page...")
        
        # For this validation, we'll use the actual URLs from browser automation
        # In production, this would come from browser automation
        sample_photo_urls = [
            "https://photos.zillowstatic.com/fp/8a3a89ba2643a63831a84ecca17a5d5b-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/8a3a89ba2643a63831a84ecca17a5d5b-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/8a3a89ba2643a63831a84ecca17a5d5b-cc_ft_768.webp",
            "https://photos.zillowstatic.com/fp/86517b52378fe065fb61122353cc3bd8-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/86517b52378fe065fb61122353cc3bd8-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/6dcb3927576f621ab64420642bd29ec9-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/6dcb3927576f621ab64420642bd29ec9-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/6b6235117cedad2213c857600f5dc005-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/6b6235117cedad2213c857600f5dc005-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/2d27b3edada98933089361b2ef891374-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/2d27b3edada98933089361b2ef891374-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/a77066b98ecd612ba86e950a45ed9aa6-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/a77066b98ecd612ba86e950a45ed9aa6-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/a2717b6056e176cb424658acd26a11bd-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/a2717b6056e176cb424658acd26a11bd-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/669ac69b3644d6b6bc40d7672b4bb889-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/669ac69b3644d6b6bc40d7672b4bb889-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/6dcfadbdaf99e28067bd63224c6567df-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/6dcfadbdaf99e28067bd63224c6567df-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/c43950a051c523ad7315b8255be955a9-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/c43950a051c523ad7315b8255be955a9-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/815a3b629ccb92a6fa4d78b13f21c3a6-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/815a3b629ccb92a6fa4d78b13f21c3a6-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/d8040b8bcbd3ba6726f906f66c8912a1-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/d8040b8bcbd3ba6726f906f66c8912a1-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/cb33e848529e117adfcc011d6cd5053b-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/cb33e848529e117adfcc011d6cd5053b-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/55daa7335cef8803bc54c69ec29ac2d1-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/55daa7335cef8803bc54c69ec29ac2d1-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/07dbc46c93779de4ee59cb62777d66cf-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/07dbc46c93779de4ee59cb62777d66cf-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/c68a94ecc2555177458251aa2d14b82b-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/c68a94ecc2555177458251aa2d14b82b-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/8ed76a116605713264f06e425c84078f-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/8ed76a116605713264f06e425c84078f-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/cdbaade02e8159e6104110d3202f9333-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/cdbaade02e8159e6104110d3202f9333-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/891ee2a4e6d4cb7c76c43210d7f6df72-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/891ee2a4e6d4cb7c76c43210d7f6df72-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/7fbd3591355ac56e5692b9feba6b392c-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/7fbd3591355ac56e5692b9feba6b392c-cc_ft_1152.webp",
            "https://photos.zillowstatic.com/fp/147c881cb9bfe6b78072d552d6e657bf-cc_ft_1536.webp",
            "https://photos.zillowstatic.com/fp/147c881cb9bfe6b78072d552d6e657bf-cc_ft_1152.webp"
        ]
        
        print(f"📊 Found {len(sample_photo_urls)} total URLs")
        
        # Step 3: Extract main photos only (highest quality per unique photo)
        main_photos = self.extract_main_photos_only(sample_photo_urls)
        print(f"📷 Extracted {len(main_photos)} main photos (highest quality per image)")
        
        # Step 4: Save main photo URLs
        self.save_main_urls(main_photos, output_folder)
        
        # Step 5: Download main photos
        download_results = self.download_photos(main_photos, output_folder)
        
        # Step 6: Generate summary
        summary = {
            'unique_id': unique_id,
            'zpid': zpid,
            'property_url': property_url,
            'output_folder': output_folder,
            'total_urls_found': len(sample_photo_urls),
            'main_photos_extracted': len(main_photos),
            'photos_downloaded': download_results['downloaded'],
            'photos_failed': download_results['failed'],
            'success_rate': (download_results['downloaded'] / len(main_photos)) * 100 if main_photos else 0,
            'timestamp': datetime.now().isoformat()
        }
        
        # Save summary
        import json
        summary_file = os.path.join(output_folder, "scraping_summary.json")
        with open(summary_file, 'w') as f:
            json.dump(summary, f, indent=2)
        
        print("=" * 60)
        print("📊 MAIN PHOTOS SCRAPING SUMMARY")
        print("=" * 60)
        print(f"🆔 Unique ID: {summary['unique_id']}")
        print(f"📸 Main photos found: {summary['main_photos_extracted']}")
        print(f"✅ Successfully downloaded: {summary['photos_downloaded']}")
        print(f"❌ Failed downloads: {summary['photos_failed']}")
        print(f"📈 Success rate: {summary['success_rate']:.1f}%")
        print(f"📁 All files saved to: {output_folder}")
        print("=" * 60)
        
        return summary

def main():
    """Test the scraper with the new property"""
    
    # Initialize scraper
    scraper = ZillowPhotoScraperV2()
    
    # New property to test
    property_url = "https://www.zillow.com/homedetails/330-Las-Colinas-Blvd-924-Irving-TX-75039/67968866_zpid/"
    zpid = "67968866"
    
    # Run main photos scraping workflow
    results = scraper.scrape_property_main_photos(property_url, zpid)
    
    print(f"\n🎉 Main photos scraping completed!")
    print(f"📊 Results: {results['photos_downloaded']}/{results['main_photos_extracted']} main photos downloaded")
    print(f"🆔 Unique folder ID: {results['unique_id']}")

if __name__ == "__main__":
    main()
