#!/bin/bash

# API endpoint URL
API_ENDPOINT="http://localhost:8000/agent/tasks"

# Define your JSON payload according to the TaskRequestBody schema.
# This is just a sample payload; modify it to match your schema.
JSON_PAYLOAD='{
    "input": "Calculate 2 + 3 + sqrt(233)"
}'

# Execute curl command
response=$(curl -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD")

# Optionally print response
echo "$response"

# Extract and save the task_id using jq (if you have it installed).
# task_id=$(echo "$response" | jq -r '.task_id')
# echo "Task ID: $task_id"