'use strict';

const AWS = require('aws-sdk');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.');

const docClient = new AWS.DynamoDB.DocumentClient();

exports.handle = (event, context) => {
  if (!event.targetUrl) return context.succeed({ shortToken: null, error: 'Missing targetUrl' });
  const targetUrl = String(event.targetUrl);
  const queryParams = {
    TableName: 'UrlShortner',
    IndexName: 'targetUrl-index',
    KeyConditionExpression: 'targetUrl = :v_targetUrl',
    ExpressionAttributeValues: {
      ':v_targetUrl': targetUrl,
    },
    ProjectionExpression: 'shortToken',
  };
  const shortToken = (event.shortToken) ? String(event.shortToken) : shortid.generate();
  return docClient.query(queryParams, (getErr, getData) => {
    if (!event.shortToken) {
      // Already exists
      if (getErr) {
        console.log(getErr);
        return context.succeed({ shortToken: null, error: getErr.message, queryParams });
      }
      if ('Items' in getData && getData.Items.length > 0 && 'shortToken' in getData.Items[0]) {
        return context.succeed({ shortToken: getData.Items[0].shortToken });
      }
    }

    // New
    const postParams = {
      TableName: 'UrlShortner',
      Item: {
        shortToken: shortToken,
        targetUrl: targetUrl,
        createdAt: Date.now(),
      },
    };

    return docClient.put(postParams, (postErr) => {
      if (postErr) {
        console.log(postErr);
        return context.succeed({ shortToken: null, error: postErr.message, postParams });
      }
      return context.succeed({ shortToken });
    });
  });
};
