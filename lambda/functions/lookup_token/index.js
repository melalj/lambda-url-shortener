'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

function notFound(context) {
  const content = '<html><body><h1>Not Found</h1></body></html>';
  context.fail(content);
}

exports.handle = (event, context) => {
  if (!event.shortToken) return notFound(context);
  const queryParams = {
    TableName: 'UrlShortner',
    KeyConditionExpression: 'shortToken = :v_shortToken',
    ExpressionAttributeValues: {
      ':v_shortToken': String(event.shortToken),
    },
    ProjectionExpression: 'targetUrl',
  };

  return docClient.query(queryParams, (err, data) => {
    if (err) {
      console.log(err);
      return notFound(context);
    }
    if ('Items' in data && data.Items.length > 0 && 'targetUrl' in data.Items[0]) {
      const url = data.Items[0].targetUrl;
      const content = `<html><body>Moved: <a href="${url}">${url}</a></body></html>`;
      return context.succeed({
        url,
        content,
      });
    }
    return notFound(context);
  });
};
