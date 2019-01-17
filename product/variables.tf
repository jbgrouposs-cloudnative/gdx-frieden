variable "stage" {
  default = "prod"
}

# For VPC
variable "vpcsubnet" {
  default = "192.168.0.0/16"
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

variable "single_nat_gateway" {
  default = true
}

variable "one_nat_gateway_per_az" {
  default = false
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

# For EKS
variable "eks_cluster_name" {
  default = "gdx-cluster"
}

variable "kubeconfig_aws_authenticator_env_variables" {
  type = "map"

  default = {
    "AWS_PROFILE" = "gdx"
  }
}

variable "eks_worker_instance_type" {
  default = "t3.medium"
}

# For ECR
variable "ecr_name" {
  default = "gdx-prod"
}

variable "rds_cluster_name" {
  default = "gdx-cluster"
}

variable "rds_username" {
  default = "gdx"
}

variable "rds_password" {
  default = "M5d2gUNVQYBRs5kyccTEmJ3A"
}
