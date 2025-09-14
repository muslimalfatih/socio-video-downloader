-- Create downloads table
CREATE TABLE IF NOT EXISTS downloads (
    id VARCHAR(36) PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    title TEXT,
    file_size BIGINT,
    format VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    download_url TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_downloads_client_id ON downloads(client_id);
CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON downloads(created_at);
CREATE INDEX IF NOT EXISTS idx_downloads_status ON downloads(status);
