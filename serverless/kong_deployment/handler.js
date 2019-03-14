'use strict';

const main = require('./main');

// DynamoDBのデータ更新ハンドラー
module.exports.deployment_dynamodb = (event, context) => {

  // レコード単位で並列に処理を行う
  Promise.all(event.Records.map(async r => {
    const eventName = r.eventName;
    const provider = r.dynamodb.Keys.provider.S;
    const object = r.dynamodb.Keys.object.S;

    console.log(`eventName : ${eventName}`);
    console.log(`provider  : ${provider}`);
    console.log(`object    : ${object}`);

    if (object === 'ENDPOINT') {
      if (eventName === 'INSERT') {
        await main.handleInsert(provider);
      } else if (eventName === 'MODIFY') {
        await main.handleModify(provider);
      } else if (eventName === 'REMOVE') {
        await main.handleRemove(provider);
      } else {
        console.log(`${eventName} not supported.`);
      }
    }
    
  })).then(() => {
    context.succeed('OK');
  }).catch((err) => {
    context.fail(err);
  });
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

      // サービスを作成or更新
      axios.put(`${kongAdminUrl}/services/${api_name}-${api_version}`, {
        name: `${api_name}-${api_version}`,
        protocol: 'http',
        host: container_info.name,
        port: container_info.port
      }).then(function (res) {
        console.log(res);

        // サービスに対するルートを作成or更新
        axios.put(`${kongAdminUrl}/routes/${api_name}-${api_version}`, {
          protocols: ['http'],
          paths: [`/${api_name}/${api_version}`],
          service: {
            id: res.data.id
          }
        }).then(function (res) {
          console.log(res);
          context.succeed("OK");
        }).catch(err => error_handler(err, context));

      }).catch(err => error_handler(err, context));
    }
  });
};