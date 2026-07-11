#!/usr/bin/env python3
"""Create the insight-vault database on Neon"""
import base64, urllib.request, json, os, time, sys

neon_b64 = "bmFwaV93YmU5NjA2dml5NmZqemp0aTJrMmZlNWRocGxoNHVnMXN3YTg2NjE1dHVjM21wYWh4OWhvb3lycjl2amI0d3cz"
neon_key = base64.b64decode(neon_b64).decode()

NEON_API = "https://console.neon.tech/api/v2"
PROJECT_ID = "raspy-star-93431686"
DB_NAME = "insight-vault"

def neon_api(method, path, data=None, retries=3):
    url = f"{NEON_API}{path}"
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, method=method)
            req.add_header('Authorization', f'Bearer {neon_key}')
            req.add_header('Accept', 'application/json')
            req.add_header('Content-Type', 'application/json')
            if data:
                req.data = json.dumps(data).encode()
            resp = urllib.request.urlopen(req)
            raw = resp.read()
            return json.loads(raw) if raw else {}
        except urllib.error.HTTPError as e:
            err_raw = e.read()
            body = json.loads(err_raw) if err_raw else {}
            print(f"  Attempt {attempt+1}: {e.code} - {body.get('message','')}")
            if e.code == 423:
                time.sleep(5)
                continue
            return None
    return None

# Get main branch
branches = neon_api('GET', f'/projects/{PROJECT_ID}/branches')
if not branches:
    print("ERROR: Could not get branches")
    sys.exit(1)

main_branch_id = None
for b in branches.get('branches', []):
    if b['name'] == 'main':
        main_branch_id = b['id']
        break

if not main_branch_id:
    print("ERROR: Could not find main branch")
    sys.exit(1)

# Check if DB exists
dbs = neon_api('GET', f'/projects/{PROJECT_ID}/branches/{main_branch_id}/databases')
if dbs:
    for db in dbs.get('databases', []):
        if db['name'] == DB_NAME:
            print(f"Database '{DB_NAME}' already exists")
            # Still need to get the host for .env
            endpoints = neon_api('GET', f'/projects/{PROJECT_ID}/endpoints')
            if endpoints and endpoints.get('endpoints'):
                host = endpoints['endpoints'][0]['host']
                password = "npg_GYnSRj3lZcV5"
                conn_str = f"postgresql://neondb_owner:{password}@{host}/{DB_NAME}?sslmode=require"
                print(f"Database URL: {conn_str}")
                # Save .env
                env_path = "/opt/data/repositorios/2026-07-11-insight-vault/apps/api/.env"
                os.makedirs(os.path.dirname(env_path), exist_ok=True)
                with open(env_path, 'w') as f:
                    f.write(f"DATABASE_TYPE=postgres\n")
                    f.write(f"DATABASE_URL={conn_str}\n")
                    f.write(f"PORT=3000\n")
                    f.write(f"JWT_SECRET=iv_jwt_secret_2026_insight_vault\n")
                    f.write(f"JWT_EXPIRATION=7d\n")
                    f.write(f"CORS_ORIGIN=http://localhost:4200\n")
                print(f"Saved .env to {env_path}")
            sys.exit(0)

# Create database
print(f"Creating database '{DB_NAME}'...")
result = neon_api('POST', f'/projects/{PROJECT_ID}/branches/{main_branch_id}/databases', {
    'database': {'name': DB_NAME, 'owner_name': 'neondb_owner'}
})

if result:
    print(f"Created: {result['database']['name']}")
else:
    print(f"ERROR: Failed to create database")
    sys.exit(1)

# Get host for connection string
endpoints = neon_api('GET', f'/projects/{PROJECT_ID}/endpoints')
if endpoints and endpoints.get('endpoints'):
    host = endpoints['endpoints'][0]['host']
    password = "npg_GYnSRj3lZcV5"
    conn_str = f"postgresql://neondb_owner:{password}@{host}/{DB_NAME}?sslmode=require"
    print(f"Database URL: {conn_str}")
    
    env_path = "/opt/data/repositorios/2026-07-11-insight-vault/apps/api/.env"
    os.makedirs(os.path.dirname(env_path), exist_ok=True)
    with open(env_path, 'w') as f:
        f.write(f"DATABASE_TYPE=postgres\n")
        f.write(f"DATABASE_URL={conn_str}\n")
        f.write(f"PORT=3000\n")
        f.write(f"JWT_SECRET=iv_jwt_secret_2026_insight_vault\n")
        f.write(f"JWT_EXPIRATION=7d\n")
        f.write(f"CORS_ORIGIN=http://localhost:4200\n")
    print(f"Saved .env to {env_path}")
