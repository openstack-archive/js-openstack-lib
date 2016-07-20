::

  Copyright 2016 Hewlett Packard Development Corporation, L.P.

  This work is licensed under a Creative Commons Attribution 3.0
  Unported License.
  http://creativecommons.org/licenses/by/3.0/legalcode

..


===================================
DevStack and Third-Party CI Systems
===================================

This spec attempts to outline the various requirements regarding testing
against upstream OpenStack, and accepting feedback from downstream
consumers of our library.

Problem Description
===================

We are, effectively, a downstream consumer of the OpenStack API's, which
means that we're effectively building on quicksand. Even after a release has
been published, backports can break any integration tests that we write.
While we can't force the upstream projects to confirm that they remain
backwards compatible, we can nevertheless ensure that we are notified as
quickly as possible when something breaks.

Furthermore, it is very likely that OpenStack deployers, such as Rackspace,
Mirantis, HPE, or others, will build their own developer tooling on top of
ours, creating the potential for cascading gate failures.

Proposed Change
===============

We will create a devstack gate job, run against every patch. Furthermore, we
will encourage any third-party consumers of our libraries to run similar jobs
against our patches.

Existing gate jobs will be used as a template. Third Party CI jobs will be
asked to implement the Infra documentation: `Third Party CI`_.

Implementation
==============

Assignee(s)
-----------

Primary assignee:
  TBD

Gerrit Topic
------------

Use Gerrit topic "js-devstack" for all patches related to this spec.

.. code-block:: bash

    git-review -t js-devstack

Work Items
----------

1. Create a test configuration which will run our test suite against a
   provided devstack catalog.
2. Create an npm script target which runs this test suite.
3. Create an infra job which executes the aforementioned npm script target.

Documentation
-------------

Additional documentation will need to be added to this project's Developer
Guidelines, providing a guide on how devstack jobs can be run by individual
contributors.

Security
--------

No security risks.

Testing
-------

This project will need at least one test that can be run against devstack.

Dependencies
============

- We need a way of configuring and/or discovering a cloud's endpoints.
- We need to agree on a testing framework, and whether we're targeting Node
  or Browser apps.
- We need minimal functionality (recommending keystone) that can be tested.

.. _`Third Party CI`: http://docs.openstack.org/infra/system-config/third_party.html
