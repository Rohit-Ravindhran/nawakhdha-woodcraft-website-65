-- Add rollback tracking to content_change_requests table
ALTER TABLE content_change_requests 
ADD COLUMN original_content_before_change text,
ADD COLUMN can_rollback boolean DEFAULT false,
ADD COLUMN rollback_of_request_id uuid REFERENCES content_change_requests(id);

-- Create index for better performance on rollback queries
CREATE INDEX idx_content_change_requests_rollback ON content_change_requests(rollback_of_request_id);
CREATE INDEX idx_content_change_requests_can_rollback ON content_change_requests(can_rollback) WHERE can_rollback = true;