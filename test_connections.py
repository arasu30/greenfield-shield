"""
Comprehensive API Connection Test for Greenfield Shield
Tests both frontend and backend connectivity
"""

import requests
import json
from typing import Dict, List

BASE_URL = "http://localhost:8000"

class APITester:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.results = []
        self.access_token = None
        
    def test_health(self) -> bool:
        """Test health endpoint"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            result = response.status_code == 200
            self.results.append({
                "endpoint": "GET /health",
                "status": "✓ PASS" if result else "✗ FAIL",
                "code": response.status_code
            })
            return result
        except Exception as e:
            self.results.append({
                "endpoint": "GET /health",
                "status": f"✗ FAIL - {str(e)}",
                "code": 0
            })
            return False
    
    def test_root(self) -> bool:
        """Test root endpoint"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=5)
            result = response.status_code == 200
            self.results.append({
                "endpoint": "GET /",
                "status": "✓ PASS" if result else "✗ FAIL",
                "code": response.status_code
            })
            return result
        except Exception as e:
            self.results.append({
                "endpoint": "GET /",
                "status": f"✗ FAIL - {str(e)}",
                "code": 0
            })
            return False
    
    def test_login(self) -> bool:
        """Test login endpoint"""
        try:
            payload = {
                "email": "admin@gmail.com",
                "password": "12345",
                "role": "admin"
            }
            response = requests.post(
                f"{self.base_url}/auth/login",
                json=payload,
                timeout=5
            )
            result = response.status_code in [200, 201]
            if result and "access_token" in response.json().get("tokens", {}):
                self.access_token = response.json()["tokens"]["access_token"]
            
            self.results.append({
                "endpoint": "POST /auth/login",
                "status": "✓ PASS" if result else "✗ FAIL",
                "code": response.status_code
            })
            return result
        except Exception as e:
            self.results.append({
                "endpoint": "POST /auth/login",
                "status": f"✗ FAIL - {str(e)}",
                "code": 0
            })
            return False
    
    def test_auth_me(self) -> bool:
        """Test get current user endpoint"""
        if not self.access_token:
            self.results.append({
                "endpoint": "GET /auth/me",
                "status": "⊘ SKIPPED - No access token",
                "code": 0
            })
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = requests.get(
                f"{self.base_url}/auth/me",
                headers=headers,
                timeout=5
            )
            result = response.status_code == 200
            self.results.append({
                "endpoint": "GET /auth/me",
                "status": "✓ PASS" if result else "✗ FAIL",
                "code": response.status_code
            })
            return result
        except Exception as e:
            self.results.append({
                "endpoint": "GET /auth/me",
                "status": f"✗ FAIL - {str(e)}",
                "code": 0
            })
            return False
    
    def test_schemes(self) -> bool:
        """Test schemes endpoint"""
        try:
            response = requests.get(
                f"{self.base_url}/schemes/",
                timeout=5
            )
            result = response.status_code == 200
            self.results.append({
                "endpoint": "GET /schemes/",
                "status": "✓ PASS" if result else "✗ FAIL",
                "code": response.status_code
            })
            return result
        except Exception as e:
            self.results.append({
                "endpoint": "GET /schemes/",
                "status": f"✗ FAIL - {str(e)}",
                "code": 0
            })
            return False
    
    def print_results(self):
        """Print test results"""
        print("\n" + "="*70)
        print("GREENFIELD SHIELD - API CONNECTION TEST RESULTS")
        print("="*70 + "\n")
        
        for result in self.results:
            status_width = 40
            endpoint = result["endpoint"]
            status = result["status"]
            code = str(result["code"])
            
            print(f"  {endpoint:<30} {status:<25} [Code: {code}]")
        
        print("\n" + "="*70)
        passed = sum(1 for r in self.results if "✓ PASS" in r["status"])
        total = len(self.results)
        print(f"SUMMARY: {passed}/{total} tests passed")
        print("="*70 + "\n")
        
        if passed == total:
            print("✓ All connections are working perfectly!")
        else:
            print("⚠ Some connections failed. Please check the output above.")

def main():
    """Run all tests"""
    print("\nInitializing API Connection Tests...\n")
    
    tester = APITester(BASE_URL)
    
    # Run all tests in order
    tests = [
        ("Backend Health Check", tester.test_health),
        ("Root Endpoint", tester.test_root),
        ("Admin Login", tester.test_login),
        ("Get Current User", tester.test_auth_me),
        ("Get Schemes", tester.test_schemes),
    ]
    
    for test_name, test_func in tests:
        print(f"Running: {test_name}...", end=" ")
        try:
            test_func()
            print("Done")
        except Exception as e:
            print(f"Error: {e}")
    
    # Print final results
    tester.print_results()

if __name__ == "__main__":
    main()
