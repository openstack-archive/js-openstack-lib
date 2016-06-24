::

  Copyright 2016 Mirantis, Inc.

  This work is licensed under a Creative Commons Attribution 3.0
  Unported License.
  http://creativecommons.org/licenses/by/3.0/legalcode

..

=======================================
Interaction with OpenStack Services API
=======================================

We need to agree on the approach that will be used for interaction with
OpenStack services API that would fit needs of library users.

Problem Description
===================

Choice of a method of communication with OpenStack API it the key decision
for the project. The main requirement here is that the chosen method must be
isomorphic - the same code must work both with the latest versions of popular
browsers (Chrome 50, Firefox 47) and Node v4.

Proposed Change
===============

This project will use window.fetch() function to interact with OpenStack API.
fetch() is a modern XMLHTTPRequest with a frendlier interface, which is
supported by majority of the browsers. For browsers which don't support it,
there is a very popular `polyfill`_ from Github.

For node.js `node-fetch`_ module should be used. It implements the same fetch()
interface which works on node.js environments.

fetch() should be called directly from clients, without any extra wrappers.
Such wrapper could be added later, for example, to handle caching and parallel
requests, but there should be a separate spec for this.

Alternatives
------------

There are a few isomorphic libraries for making HTTP requests and interacting
with REST API. I think the project should stick to fetch() because:

* Libraries for making HTTP requests (like `superagent`_) were mostly created
  when there was no fetch(). They mostly do the same thing - provide a
  friendlier interface over XMLHTTPRequest. Since there is fetch() standard,
  it makes very little sense to use them.

* There is `isomorphic-fetch`_ module, which is more popular than
  `node-fetch`_. It implements XMLHttpRequest to node.js environment to run
  browser-specific polyfill. Approach of `node-fetch`_ which implements fetch()
  using node "http" module (without implementing XMLHTTPRequest) is
  considered simpler.

Implementation
==============

Assignee(s)
-----------

Primary assignee:
  vkramskikh

Gerrit Topic
------------

Use Gerrit topic "neverland" for all patches related to this spec.

.. code-block:: bash

    git-review -t neverland

Work Items
----------

* Add node-fetch to the project dependencies.

Documentation
-------------

The process of creating a new OpenStack service client using the approach
described in this spec should be documented.

Security
--------

None

Testing
-------

Tests will be written for node and browsers.

Dependencies
============

Since node-fetch is a project dependency, but it shouldn't be included in the
browser build, most likely we need to implement transpiling and build systems
first.

.. _polyfill: https://github.com/github/fetch
.. _node-fetch: https://github.com/bitinn/node-fetch
.. _superagent: https://github.com/visionmedia/superagent
.. _isomorphic-fetch: https://github.com/matthew-andrews/isomorphic-fetch
