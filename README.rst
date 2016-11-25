========================
Team and repository tags
========================

.. image:: http://governance.openstack.org/badges/js-openstack-lib.svg
    :target: http://governance.openstack.org/reference/tags/index.html

.. Change things from this point on

JS-OpenStack-lib
================

JS-OpenStack-lib is a Javascript library for interacting with OpenStack clouds. The project aims to provide a constistent and complete set of interactions with OpenStack's many services, along with documentations, examples, and tools.
This library is compatible with both browser and server side Javascript.

Example
-------

The following example simply connects to an OpenStack cloud and list flavors in the Compute service:

::

   import OpenStack from 'js-openstack-lib';

   // Initialize cloud
   // cloudConfig is a JSON object corresponding to clouds.yaml
   // (It is your responsibility to load and parse it)
   const openStack = new OpenStack({
     region_name: 'Region1',
     auth: {
       username: 'user',
       password: 'pass',
       project_name: 'js-openstack-lib',
       auth_url: 'http://192.168.99.99/'
     }
   });
   // List all flavors
   openStack.networkList()
     .then((networks) => {
       console.log(networks);
     });

Documentation
-------------

Coming soon

Contributing
------------

If you're interested in contributing, the following will help you get started:

:Bug Tracker: https://storyboard.openstack.org/#!/project/844
:Code Hosting: https://git.openstack.org/cgit/openstack/js-openstack-lib
:Code Review:
    https://review.openstack.org/#/q/status:open+project:openstack/js-openstack-lib,n,z

    Please read `Developer's Guide <http://docs.openstack.org/infra/manual/developers.html>`_ before sending your first patch for review



License
-------

Apache 2.0


