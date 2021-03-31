## Deploy Storefront to Firebase

Pre-rendered views and assets to [Firebase Hosting](https://firebase.google.com/docs/hosting?hl=pt-br), non-pre-rendered views SSRed with [Cloud Functions](https://firebase.google.com/docs/functions) and cached (acting like ISG).

### Getting started

1. [Create a service account](https://console.cloud.google.com/iam-admin/serviceaccounts) for your Firebase project directly on Google Cloud Platform;
2. Generate and download a JSON key for the created account;
3. Add a _secret_ to your GitHub repository with name `GCP_ACCOUNT_KEY` and paste the key JSON;

#### Prepare CI files

4. Edit `.dependabot/config.yml` to update `/.functions` directory instead of Netlify functions default one;
5. Copy new build and deploy GitHub Actions workflow from `.github/workflows/.firebase/build-and-deploy.yml` to `.github/workflows/build-and-deploy.yml`;

```bash
sed -i 's/.netlify\/functions\/ssr/.functions/' ./.dependabot/config.yml
mv ./.github/workflows/.firebase/build-and-deploy.yml ./.github/workflows/build-and-deploy.yml
```
