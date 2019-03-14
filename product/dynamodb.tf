resource "aws_dynamodb_table" "gdx-dome-dynamodb" {
  name         = "GDXDomeDynamoDB"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "provider"
  range_key    = "object"
  stream_enabled    = true
  stream_view_type  = "NEW_IMAGE"

  attribute {
    name = "provider"
    type = "S"
  }

  attribute {
    name = "object"
    type = "S"
  }
}
