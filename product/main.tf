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

  tags = "${merge(local.tags, map("kubernetes.io/cluster/${var.eks_cluster_name}","shared"))}"

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = ""
  }

  public_subnet_tags = {
    "kubernetes.io/role/elb" = ""
  }
}

module "eks" {
  source                                     = "terraform-aws-modules/eks/aws"
  version                                    = "2.0.0"
  cluster_name                               = "${var.eks_cluster_name}-${var.stage}"
  subnets                                    = "${module.vpc.private_subnets}"
  worker_groups                              = "${local.worker_groups}"
  worker_group_count                         = "1"
  vpc_id                                     = "${module.vpc.vpc_id}"
  kubeconfig_aws_authenticator_env_variables = "${var.kubeconfig_aws_authenticator_env_variables}"

  tags = {
    Stage = "${var.stage}"
  }
}

module "ecr" {
  source   = "../modules/ecr"
  ecr_name = "${var.ecr_name}"
}

module "web_sg" {
  source = "terraform-aws-modules/security-group/aws//modules/http-80"

  name        = "web-server"
  description = "Security group for web-server with HTTP ports open within VPC"
  vpc_id      = "${module.vpc.vpc_id}"

  ingress_cidr_blocks = ["0.0.0.0/0"]
}

module "alb" {
  source                   = "terraform-aws-modules/alb/aws"
  load_balancer_name       = "gdx-${var.stage}"
  security_groups          = ["${module.web_sg.this_security_group_id}", "${module.eks.worker_security_group_id}"]
  subnets                  = "${module.vpc.public_subnets}"
  vpc_id                   = "${module.vpc.vpc_id}"
  http_tcp_listeners       = "${list(map("port", "80", "protocol", "HTTP"))}"
  http_tcp_listeners_count = "1"
  target_groups            = "${list(map("name", "gdx-${var.stage}", "backend_protocol", "HTTP", "backend_port", "30000"))}"
  target_groups_count      = "1"
  logging_enabled          = false
}

locals {
  worker_groups = [
    {
      instance_type     = "${var.eks_worker_instance_type}"
      subnets           = "${join(",", module.vpc.private_subnets)}"
      target_group_arns = "${join(",", module.alb.target_group_arns)}"
    },
  ]

  tags = {
    Stage = "${var.stage}"
  }
}

resource "aws_iam_policy" "ingress-controller-iam-policy" {
  name   = "ingress-controller-iam-policy"
  policy = "${file("policy/ingressController-iam-policy")}"
}

resource "aws_iam_role_policy_attachment" "workers-EKS-ALB-policy" {
  role       = "${module.eks.worker_iam_role_name}"
  policy_arn = "${aws_iam_policy.ingress-controller-iam-policy.arn}"
}

/*
resource "aws_rds_cluster" "gdx" {
  cluster_identifier      = "${var.rds_cluster_name}"
  engine                  = "aurora-postgresql"
  engine_mode             = "serverless"
  availability_zones      = "${module.vpc.azs}"
  database_name           = "gdx-${var.stage}"
  master_username         = "${var.rds_username}"
  master_password         = "${var.rds_password}"
  backup_retention_period = 5
  preferred_backup_window = "07:00-09:00"

  scaling_configuration {
    auto_pause               = true
    max_capacity             = 5
    min_capacity             = 1
    seconds_until_auto_pause = 3600
  }
}
*/

