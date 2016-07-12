# Lambda Url shortener

Basic url shortener using AWS Lambda and DynamoDB (uses [shortid](https://github.com/dylang/shortid) for shortToken)

Inspiration from: [Build a serverless URL shortener with AWS Lambda and API Gateway services](http://www.davekonopka.com/2016/serverless-aws-lambda-api-gateway.html)

## API endpoints
- URL: `POST /`
  - apiKey required
  - Params type: `json`
  - Required Body Params: `targetUrl`
  - Optional Body Params: `shortToken`
  - Output: `shortToken`

- URL: `GET /:token`
  - Params type: `json`
  - Required Path Params: `token`
  - Output: `targetUrl`

( need more documentation... PR welcome)

## Get started

### Requirements
- [Terraform](https://www.terraform.io/)
- [AWS API Gateway importer](https://github.com/awslabs/aws-apigateway-importer)
- [Apex](https://github.com/apex/apex)

### Commands
```sh
# replace {{AWS_ACCOUNT_NUMBER}} first in api-swagger.yml and lambda/function/*/function.json with your aws account number
terraform apply
cd lambda && apex deploy

# you'll need to follow the instructions on https://github.com/awslabs/aws-apigateway-importer
aws-api-import -c ./api-swagger.yml
```

### Test Commands
```sh
cd lambda
echo '{ "shortToken": "test", "targetUrl": "https://www.google.com/" }' | apex invoke post_token
echo '{ "shortToken": "test" }' | apex invoke lookup_token
```
