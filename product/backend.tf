terraform {
  backend "s3" {
    bucket  = "gdx-frieden"
    key     = "terraform/product/terraform.tfstate"
    region  = "us-west-2"
    profile = "gdx"
  }
}
