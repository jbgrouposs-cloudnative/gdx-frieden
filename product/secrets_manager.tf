variable "gdx-dome-secrets-value" {
  default = {
    token = "TOKEN_STRING"
  }
  type = "map"
}

resource "aws_secretsmanager_secret" "gdx-dome-secrets" {
  name = "gdx-dome-secrets"
}

resource "aws_secretsmanager_secret_version" "token" {
  secret_id     = "${aws_secretsmanager_secret.gdx-dome-secrets.id}"
  secret_string = "${jsonencode(var.gdx-dome-secrets-value)}"
}