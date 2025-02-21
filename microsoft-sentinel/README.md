# Microsoft Sentinel Playbook for urlDNA

## Overview
This playbook is designed to automate the process of scanning URLs found in Microsoft Sentinel incidents. It follows these steps:

1. Extracts URL entities from a Sentinel incident.
2. Calls the urlDNA API to analyze the extracted URLs.
3. Formats the results and adds them as a comment to the incident.

## Playbook Versions
There are two versions of this playbook:

- **Version 1:** Stores the urlDNA API key in a playbook variable (not recommended for security reasons).
- **Version 2:** Uses Azure Key Vault to securely retrieve the urlDNA API key programmatically.

## Deployment
You can deploy the playbook of your choice automatically by clicking the **Deploy to Azure** button below:

- **Version 1 (without Azure Key Vault):** [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fformat81%2Fintegrations%2Frefs%2Fheads%2Fsentinel%2Fmicrosoft-sentinel%2Fazuredeploy.json)

- **Version 2 (with Azure Key Vault):**    [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fformat81%2Fintegrations%2Frefs%2Fheads%2Fsentinel%2Fmicrosoft-sentinel%2Fazuredeploy-kv.json)

## Configuration Instructions
For detailed setup and configuration instructions, please refer to the following configuration guide(#).

