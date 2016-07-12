# Lambda Url Shortner

Basic url shortner using AWS Lambda and DynamoDB (uses shortid npm package)

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
# replace first {{AWS_ACCOUNT_NUMBER}} with you aws account number (command + F is your friend)
terraform apply
aws-api-import -c ./api-swagger.yml # you'll need to follow the instruction on https://github.com/awslabs/aws-apigateway-importer
cd lambda && apex deploy
```

### Test Commands
```sh
cd lambda
echo '{ "shortToken": "test", "targetUrl": "https://www.google.com/" }' | apex invoke post_token
echo '{ "shortToken": "test" }' | apex invoke lookup_token
```
