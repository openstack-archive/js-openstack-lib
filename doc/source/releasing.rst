===============================
How to release js-openstack-lib
===============================

Only follow these steps if you have authority to release a version of js-openstack-lib.

1. Ensure that you have gpg set up locally.
   If you do not currently have gpg installed:

   `brew install gpg gpg2`

   Set up your gpg key:

   https://wiki.openstack.org/wiki/Oslo/ReleaseProcess#Setting_Up_GPG

2. `git pull --ff-only`

3. `git tag -s <version number>`

4. `git push gerrit <version number>`

    Git won’t have a remote named gerrit until the first time git-review runs.
    You may need to run git review -s before the push.

For more information see:
http://docs.openstack.org/infra/manual/drivers.html#tagging-a-release
