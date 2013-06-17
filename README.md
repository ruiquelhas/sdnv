SDNV
====

Self-Delimiting Numeric Value Codec
-----------------------------------

Node.js wrapper for Self-Delimiting Numeric Values (SDNVs). Provides a base class to use SDNVs in Node programs and 
appropriate utility functions to encode and decode native buffers to and from SDNVs.

### What are SDNVs? ###

SDNVs were created by the [DTNRG](http://www.dtnrg.org) and they aim to overcome common problems related to fixed size 
fields in networking protocols (e.g. TPC's `advertised received window` field and the entire IPv4 PDU).

As stated in the official spec released as the [RFC 6256](http://tools.ietf.org/html/rfc6256):

    An SDNV is simply a way of representing non-negative integers (bothpositive integers of arbitrary magnitude and 0)
    without expending much unnecessary space.

SDNVs closely resemble certain constructs with [ASN.1](http://en.wikipedia.org/wiki/Abstract_Syntax_Notation_One) but 
they are focused exclusively on numeric strings or bistrings unlike the latter which was developed for encoding more 
complex data structures.

### How do they work? ###

### How to use this module? ###
