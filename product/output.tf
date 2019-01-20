output "cluster_endpoint" {
  value = "${module.eks.cluster_endpoint}"
}

/*
output "rds_gdx_endpoint" {
  value = "${aws_rds_cluster.gdx.endpoint}"
}
*/

