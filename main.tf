provider "aws" {
	access_key = "${var.aws_access_key}"
	secret_key = "${var.aws_secret_key}"
	region = "${var.aws_region}"
}

resource "aws_dynamodb_table" "UrlShortener" {
    name = "UrlShortener"
    read_capacity = 5
    write_capacity = 5
    hash_key = "shortToken"
    range_key = "createdAt"
    attribute {
      name = "shortToken"
      type = "S"
    }
    attribute {
      name = "createdAt"
      type = "N"
    }
    attribute {
      name = "targetUrl"
      type = "S"
    }
    global_secondary_index {
      name = "targetUrl-index"
      hash_key = "targetUrl"
      range_key = "createdAt"
      write_capacity = 5
      read_capacity = 5
      projection_type = "KEYS_ONLY"
    }
}

resource "aws_iam_role_policy" "redir_logs_rw" {
    name = "redir_logs_rw"
    role = "${aws_iam_role.lambda_redir.id}"
    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CloudWatchRW",
            "Resource": "*",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Effect": "Allow"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy" "redir_data_rw" {
    name = "redir_data_rw"
    role = "${aws_iam_role.lambda_redir.id}"
    policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "DynamoDBRW",
            "Action": [
                "dynamodb:DeleteItem",
                "dynamodb:Get*",
                "dynamodb:PutItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:UpdateItem"
            ],
            "Effect": "Allow",
            "Resource": "*"
        }
      ]
}
EOF
}

resource "aws_iam_role" "lambda_redir" {
    name = "lambda_redir"
    assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}
