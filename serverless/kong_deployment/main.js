'use strict';

const operations = require('./operations');

/**
 * DynamoDB INSERTイベントに対する処理
 */
module.exports.handleInsert = async (provider) => {
    console.log('handleInsert');

    // DynamoDBからデータを取得
    var endpoint = await operations.getEndpoint(provider);
    console.log(endpoint);

    if (Object.keys(endpoint).length > 0) {
        var container_info = endpoint.Item.container_info;

        // シークレット情報を取得
        var secrets = await operations.getSecrets('gdx-dome-secrets');
        var token = secrets.token;

        // Kubernetesに対してコンテナを展開
        var namespace = await operations.createNamespace(container_info, token);
        var deployment = await operations.createDeployment(container_info, token);
        var service = await operations.createService(container_info, token);
        var kongService = await operations.createOrUpdateKongService(container_info);
        var kongRoute = await operations.createOrUpdateKongRoute(container_info, kongService.data.id);

        console.log('all resource created.');
        console.log(namespace);
        console.log(deployment);
        console.log(service);
        console.log(kongService);
        console.log(kongRoute);
    }
};

/**
 * DynamoDB MODIFYイベントに対する処理
 */
module.exports.handleModify = async (provider) => {
    console.log('handleModify');

    // DynamoDBからデータを取得
    var endpoint = await operations.getEndpoint(provider);
    console.log(endpoint);

    if (Object.keys(endpoint).length > 0) {
        var container_info = endpoint.Item.container_info;

        // シークレット情報を取得
        var secrets = await operations.getSecrets('gdx-dome-secrets');
        var token = secrets.token;

        // Kubernetesに対してコンテナを展開
        var namespace = await operations.updateNamespace(container_info, token);
        var deployment = await operations.updateDeployment(container_info, token);
        var service = await operations.updateService(container_info, token);
        var kongService = await operations.createOrUpdateKongService(container_info);
        var kongRoute = await operations.createOrUpdateKongRoute(container_info, kongService.data.id);

        console.log('all resource modified.');
        console.log(namespace);
        console.log(deployment);
        console.log(service);
        console.log(kongService);
        console.log(kongRoute);
    }
};

/**
 * DynamoDB REMOVEイベントに対する処理
 */
module.exports.handleRemove = async (provider) => {
    console.log('handleRemove');

    // DynamoDBからデータを取得
    var endpoint = await operations.getEndpoint(provider);
    console.log(endpoint);

    if (Object.keys(endpoint).length > 0) {
        var container_info = endpoint.Item.container_info;

        // シークレット情報を取得
        var secrets = await operations.getSecrets('gdx-dome-secrets');
        var token = secrets.token;

        // Kubernetesに対してコンテナを展開
        await operations.removeNamespace(container_info, token);
        await operations.removeDeployment(container_info, token);
        await operations.removeService(container_info, token);
        await operations.removeKongService(container_info);
        await operations.removeKongRoute(container_info);

        console.log('all resource removed.');
    }
};