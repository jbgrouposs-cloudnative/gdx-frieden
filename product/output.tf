output "cluster_endpoint" {
  value = "${module.eks.cluster_endpoint}"
}

output "target_arns" {
  value = "${module.alb.target_group_arns}"
}
