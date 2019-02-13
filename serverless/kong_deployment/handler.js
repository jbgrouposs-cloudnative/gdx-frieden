'use strict';

var aws = require('aws-sdk');
var documentClient = new aws.DynamoDB.DocumentClient();
var axios = require('axios');

// Kong管理APIエンドポイント
var kongAdminUrl = process.env.KONG_ADMIN_URL;

// 共通エラーハンドラー
var error_handler = (err, context) => {
  console.log(err);
  context.fail();
};

module.exports.deployment = (event, context) => {
  var api_name = event.queryStringParameters.api_name;
  var api_version = event.queryStringParameters.api_version;

  var query = {
    TableName: 'GDXDomeDynamoDB',
    Key: {
      provider: `${api_name}-${api_version}`,
      object: 'ENDPOINT'
    }
  };

  // DynamoDBから定義データを取得
  documentClient.get(query, function (err, data) {
    if (err) {
      error_handler(err, context);
    } else {
      var container_info = data.Item.container_info;

      endpoints.forEach(function (endpoint) {
        // サービスを作成or更新
        axios.put(`${kongAdminUrl}/services/${api_name}-${api_version}`, {
          name: `${api_name}-${api_version}`,
          protocol: 'http',
          host: container_info.name,
          port: container_info.port
        }).then(function (res) {
          console.log(res);

          // サービスに対するルートを作成or更新
          axios.put(`${kongAdminUrl}/services/${res.id}/routes`, {
            protocols: ['http'],
            paths: `/${api_name}/${api_version}`
          }).then(function (res) {
            console.log(res);
            context.succeed();
          }).catch(err=>error_handler(err, context));

        }).catch(err=>error_handler(err, context));

      });
    }
  });
};