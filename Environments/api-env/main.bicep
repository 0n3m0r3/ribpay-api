// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

@description('Name of the Container App')
param name string

@description('Location to deploy the environment resources')
param location string = resourceGroup().location

@description('Container image to deploy')
param containerImage string

@description('Tags to apply to environment resources')
param tags object = {}

resource containerAppEnv 'Microsoft.App/managedEnvironments@2022-03-01' = {
  name: '${name}-env'
  location: location
  properties: {}
  tags: tags
}

resource containerApp 'Microsoft.App/containerApps@2022-03-01' = {
  name: name
  location: location
  properties: {
    environmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
      }
    }
    template: {
      containers: [
        {
          name: name
          image: containerImage
          resources: {
            cpu: 1
            memory: '1.0Gi'
          }
        }
      ]
    }
  }
  tags: tags
}
