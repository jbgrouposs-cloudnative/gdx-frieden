variable "stage" {
  default = "prod"
}

variable "vpcsubnet" {
  default = "192.168.0.0/24"
}

variable "avaiability_zones" {
  default = ["us-west-2a", "us-west-2b", "us-west-2c"]
}

variable "private_subnets" {
  default = ["192.168.100.0/24", "192.168.101.0/24", "192.168.102.0/24"]
}

variable "public_subnets" {
  default = ["192.168.0.0/24", "192.168.1.0/24", "192.168.2.0/24"]
}

variable "enable_nat_gateway" {
  default = true
}

variable "enable_vpn_gateway" {
  default = false
}

variable "enable_s3_endpoint" {
  default = true
}

variable "enable_dns_hostname" {
  default = true
}

variable "enable_dns_support" {
  default = true
}
