'use strict';

const aws = require('aws-sdk');
const axios = require('axios');
const https = require('https');

const secretsManager = new aws.SecretsManager();
const documentClient = new aws.DynamoDB.DocumentClient();

// 管理APIエンドポイント
const kongAdminUrl = process.env.KONG_ADMIN_URL;
const kubeAdminUrl = process.env.KUBE_ADMIN_URL;

var queryDynamoDB = (query) => {
    return new Promise((resolve, reject) => {
        // DynamoDBから定義データを取得
        documentClient.get(query, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

/**
 * 指定したプロバイダに対するエンドポイント情報を取得
 * @param {*} provider 
 */
var getEndpoint = (provider) => {
    // DynamoDBへのクエリを構築
    var query = {
        TableName: 'GDXDomeDynamoDB',
        Key: {
            provider: provider,
            object: 'ENDPOINT'
        }
    };

    return queryDynamoDB(query);
};

/**
 * Kubernetesのnamespaceを作成する
 * @param {*} name 
 * @param {*} token 
 */
var createNamespace = (container_info, token) => {
    return new Promise((resolve, reject) => {
        var data = {
            "kind": "Namespace",
            "apiVersion": "v1",
            "metadata": {
                "name": `${container_info.namespace}`,
                "labels": {
                    "name": `${container_info.namespace}`
                }
            }
        };

        axios.post(`${kubeAdminUrl}/api/v1/namespaces`, data, {
            headers: { 'Authorization': `Bearer ${token}` },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }).then(res => {
            console.log('namespace created');
            console.log(res);

            resolve(res);
        }).catch(err => {
            console.log(err);
            if (err.response.status === 409) {
                resolve(err.response);
            }
            reject(err)
        });
    });
};

var updateNamespace = (container_info, token) => {
    return new Promise((resolve, reject) => {
        var data = {
            "kind": "Namespace",
            "apiVersion": "v1",
            "metadata": {
                "name": `${container_info.namespace}`,
                "labels": {
                    "name": `${container_info.namespace}`
                }
            }
        };

        axios.put(`${kubeAdminUrl}/api/v1/namespaces/${container_info.namespace}`, data, {
            headers: { 'Authorization': `Bearer ${token}` },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }).then(res => {
            console.log('namespace modified');
            console.log(res);

            resolve(res);
        }).catch(err => {
            console.log(err);
            if (err.response.status === 409) {
                resolve(err.response);
            }
            reject(err)
        });
    });
};

var removeNamespace = (container_info, token) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${kubeAdminUrl}/api/v1/namespaces/${container_info.namespace}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }).then(res => {
            console.log('namespace removed');
            console.log(res);

            resolve(res);
        }).catch(err => {
            console.log(err);
            if (err.response.status === 409) {
                resolve(err.response);
            }
            reject(err)
        });
    });
};

/**
 * Kubernetesに対してDeploymentを作成する
 */
var createDeployment = (container_info, token) => {
    return new Promise((resolve, reject) => {

        var data = {
            "apiVersion": "apps/v1",
            "kind": "Deployment",
            "metadata": {
                "name": `${container_info.name}`,
                "namespace": `${container_info.namespace}`
            },
            "spec": {
                "selector": {
                    "matchLabels": {
                        "app": `${container_info.name}`
                    }
                },
                "template": {
                    "metadata": {
                        "labels": {
                            "app": `${container_info.name}`
                        }
                    },
                    "spec": {
                        "containers": [
                            {
                                "name": `${container_info.name}`,
                                "image": `${container_info.image}`,
                                "ports": [
                                    {
                                        "containerPort": container_info.port
                                    }
                                ],
                                "env": container_info.environments
                            }
                        ]
                    }
                }
            }
        };

        axios.post(`${kubeAdminUrl}/apis/apps/v1/namespaces/${container_info.namespace}/deployments`, data, {
            headers: { 'Authorization': `Bearer ${token}` },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }).then(res => {
            console.log('deployment created');
            console.log(res);

            resolve(res);
        }).catch(err => {
            console.log(err);
            if (err.response.status === 409) {
                resolve(err.response);
            }
            reject(err)
        });
    });
};

var updateDeployment = (container_info, token) => {
    return new Promise((resolve, reject) => {

        var data = {
            "apiVersion": "apps/v1",
            "kind": "Deployment",
            "metadata": {
                "name": `${container_info.name}`,
                "namespace": `${container_info.namespace}`
            },
            "spec": {
                "selector": {
                    "matchLabels": {
                        "app": `${container_info.name}`
                    }
                },
                "template": {
                    "metadata": {
                        "labels": {
                            "app": `${container_info.name}`
                        }
                    },
                    "spec": {
                        "containers": [
                            {
                                "name": `${container_info.name}`,
                                "image": `${container_info.image}`,
                                "ports": [
                                    {
                                        "containerPort": container_info.port
                                    }
                                ],
                                "env": container_info.environments
                            }
                        ]
                    }
                }
            }
        };

        axios.put(`${kubeAdminUrl}/apis/apps/v1/namespaces/${container_info.namespace}/deployments/${container_info.name}`, data, {
            headers: { 'Authorization': `Bearer ${token}` },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }).then(res => {
            console.log('deployment modified');
            console.log(res);

            resolve(res);
        }).catch(err => {
            console.log(err);
            if (err.response.status === 409) {
                resolve(err.response);
            }
            reject(err)
        });
    });
};

var removeDeployment = (container_info, token) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${kubeAdminUrl}/apis/apps/v1/namespaces/${container_info.namespace}/deployments/${container_info.name}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }).then(res => {
            console.log('deployment removed');
            console.log(res);

            resolve(res);
        }).catch(err => {
            console.log(err);
            if (err.response.status === 409) {
                resolve(err.response);
            }
            reject(err)
        });
    });
};

var createService = (container_info, token) => {
    return new Promise((resolve, reject) => {
        var data = {
            "apiVersion": "v1",
            "kind": "Service",
            "metadata": {
                "name": `${container_info.name}`,
                "namespace": `${container_info.namespace}`
            },
            "spec": {
                "selector": {
                    "app": `${container_info.name}`
                },
                "ports": [
                    {
                        "port": 80,
                        "targetPort": container_info.port
                    }
                ]
            }
        };

        axios.post(`${kubeAdminUrl}/api/v1/namespaces/${container_info.namespace}/services`, data, {
            headers: { 'Authorization': `Bearer ${token}` },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }).then(res => {
            console.log('service created');
            console.log(res);

            resolve(res);
        }).catch(err => {
            console.log(err);
            if (err.response.status === 409) {
                resolve(err.response);
            }
            reject(err)
        });
    });
};

var updateService = (container_info, token) => {
    return new Promise((resolve, reject) => {
        var data = {
            "apiVersion": "v1",
            "kind": "Service",
            "metadata": {
                "name": `${container_info.name}`,
                "namespace": `${container_info.namespace}`
            },
            "spec": {
                "selector": {
                    "app": `${container_info.name}`
                },
                "ports": [
                    {
                        "port": 80,
                        "targetPort": container_info.port
                    }
                ]
            }
        };

        axios.put(`${kubeAdminUrl}/api/v1/namespaces/${container_info.namespace}/services/${container_info.name}`, data, {
            headers: { 'Authorization': `Bearer ${token}` },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }).then(res => {
            console.log('service modified');
            console.log(res);

            resolve(res);
        }).catch(err => {
            console.log(err);
            if (err.response.status === 409) {
                resolve(err.response);
            }
            reject(err)
        });
    });
};


var removeService = (container_info, token) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${kubeAdminUrl}/api/v1/namespaces/${container_info.namespace}/services/${container_info.name}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }).then(res => {
            console.log('service removed');
            console.log(res);

            resolve(res);
        }).catch(err => {
            console.log(err);
            if (err.response.status === 409) {
                resolve(err.response);
            }
            reject(err)
        });
    });
};

var createOrUpdateKongService = (container_info) => {
    return new Promise((resolve, reject) => {
        // サービスを作成or更新
        axios.put(`${kongAdminUrl}/services/${container_info.name}`, {
            name: `${container_info.name}`,
            protocol: 'http',
            host: `${container_info.name}.${container_info.namespace}`,
            port: 80
        }).then(res => {
            console.log('kong service created');
            console.log(res);
            resolve(res);
        }).catch(err => reject(err));
    });
};

var removeKongService = (container_info) => {
    return new Promise((resolve, reject) => {
        // サービスを作成or更新
        axios.delete(`${kongAdminUrl}/services/${container_info.name}`).then(res => {
            console.log('kong service removed');
            console.log(res);
            resolve(res);
        }).catch(err => reject(err));
    });
};

var createOrUpdateKongRoute = (container_info, serviceId) => {
    return new Promise((resolve, reject) => {
        // サービスに対するルートを作成or更新
        axios.put(`${kongAdminUrl}/routes/${container_info.name}`, {
            protocols: ['http', 'https'],
            paths: [`/${container_info.namespace}/${container_info.name}`],
            service: {
                id: serviceId
            }
        }).then(function (res) {
            console.log('kong route created');
            console.log(res);
            resolve(res);
        }).catch(err => reject(err));
    });
};

var removeKongRoute = (container_info) => {
    return new Promise((resolve, reject) => {
        // サービスに対するルートを作成or更新
        axios.delete(`${kongAdminUrl}/routes/${container_info.name}`).then(function (res) {
            console.log('kong route removed');
            console.log(res);
            resolve(res);
        }).catch(err => reject(err));
    });
};

var getSecrets = (id) => {
    return new Promise((resolve, reject) => {
        // AWS SecretsからEKS管理用のトークンを取得
        secretsManager.getSecretValue({ SecretId: id }, function (err, data) {
            if (err) {
                reject(err);
            }

            var result = JSON.parse(data.SecretString);
            resolve(result);
        });
    });
};

// exports
module.exports.getEndpoint = getEndpoint;
module.exports.getSecrets = getSecrets;

module.exports.createNamespace = createNamespace;
module.exports.updateNamespace = updateNamespace;
module.exports.removeNamespace = removeNamespace;

module.exports.createDeployment = createDeployment;
module.exports.updateDeployment = updateDeployment;
module.exports.removeDeployment = removeDeployment;

module.exports.createService = createService;
module.exports.updateService = updateService;
module.exports.removeService = removeService;

module.exports.createOrUpdateKongService = createOrUpdateKongService;
module.exports.removeKongService = removeKongService;

module.exports.createOrUpdateKongRoute = createOrUpdateKongRoute;
module.exports.removeKongRoute = removeKongRoute;
