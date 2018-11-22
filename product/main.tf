module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name   = "gdx-${var.stage}"
  cidr   = "${var.vpcsubnet}"

  azs             = "${var.avaiability_zones}"
  private_subnets = "${var.private_subnets}"
  public_subnets  = "${var.public_subnets}"

  enable_nat_gateway     = "${var.enable_nat_gateway}"
  single_nat_gateway     = "${var.single_nat_gateway}"
  one_nat_gateway_per_az = "${var.one_nat_gateway_per_az}"
  enable_vpn_gateway     = "${var.enable_vpn_gateway}"
  enable_s3_endpoint     = "${var.enable_s3_endpoint}"

  enable_dns_hostnames = "${var.enable_dns_hostname}"
  enable_dns_support   = "${var.enable_dns_support}"
}

module "eks" {
  source       = "terraform-aws-modules/eks/aws"
  cluster_name = "${var.eks_cluster_name}-${var.stage}"
  subnets      = "${var.private_subnets}"

  tags = {
    Stage = "${var.stage}"
  }

  vpc_id = "${module.vpc.vpc_id}"
}
