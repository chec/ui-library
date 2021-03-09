# Internationalisation (i18n)

## Localazy integration

We use Localazy to manage translations of our dictionaries. If you haven't already been invited, you can gain access to 
the Localazy dashboard by asking in Slack. The English dictionary is automatically synced with Localazy on merges to 
staging, and the current translations are automatically downloaded from Localazy during the build process on Netlify.

### Testing translations locally

By default, translations are not part of the development build pipeline. You may use `yarn translations:download` to
download them locally, but ensure that your .env file has read and write keys for Localazy - which you should be able
to retrieve from the Localazy dashboard.
