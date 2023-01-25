# How to contribute

This repository is AGPL 3.0 licensed and accepts contributions via GitHub pull requests. This document outlines some
conventions on commit message formatting, contact points for developers, and other resources to help get contributions.

## Getting started

- Fork the repository on GitHub
- Read the README.md for build instructions

## Reporting bugs and creating issues

Reporting bugs is one of the best ways to contribute. However, a good bug report has some very specific qualities, so
please read over our short document on [reporting bugs](./docs/reporting-bugs.md) before submitting a bug report. This
document might contain links to known issues, another good reason to take a look there before reporting a bug.

## Contribution flow

This is a rough outline of what a contributor's workflow looks like:

- Create a topic branch from where to base the contribution. This is usually master.
- Make commits of logical units.
- Make sure commit messages are in the proper format (see below).
- Push changes in a topic branch to a personal fork of the repository.
- Submit a pull request to danielnegri/ip-lookup.js.
- The PR must receive a LGTM from at least one maintainer found in the MAINTAINERS file.

Thanks for contributing!

### Format of the commit message

We follow a rough convention for commit messages that is designed to answer two
questions: what changed and why. The subject line should feature the what and
the body of the commit should describe the why.

```
storage: Add support to Redis

Added support to Redis for production to improve scalability of the server.

When an IP is not found in-memory, the application will store the reply of popular 
queries inside both Redis and in-memory, so that other instances can reuse 
such replies later avoiding a vendor. 

Fixes #2
```

The format can be described more formally as follows:

```
<package>: <what changed>
<BLANK LINE>
<why this change was made>
<BLANK LINE>
<footer>
```

The first line is the subject and should be no longer than 70 characters, the second
line is always blank, and other lines should be wrapped at 80 characters. This allows
the message to be easier to read on GitHub as well as in various git tools.

### Pull request across multiple files and packages

If multiple files in a package are changed in a pull request for example:

```
src/config.js
cache/redis.js
```

At the end of the review process if multiple commits exist for a single package they
should be squashed/rebased into a single commit before being merged.

```
storage: <what changed>
[..]
```

If a pull request spans many packages these commits should be squashed/rebased into a single
commit using message with a more generic `*:` prefix.

```
*: <what changed>
[..]
```
