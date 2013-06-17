SDNV
====

Self-Delimiting Numeric Value Codec
-----------------------------------

Node.js wrapper for [Self-Delimiting Numeric Values](http://www.dtnrg.org/wiki/SDNV) (SDNVs). Provides a base class to use SDNVs in Node programs and 
appropriate utility functions to encode and decode native buffers to and from SDNVs.

### What are SDNVs? ###

SDNVs were created by the [DTNRG](http://www.dtnrg.org) and they aim to overcome common problems related to fixed size 
fields in networking protocols (e.g. TPC `advertised received window` field or even the entire [IPv4 header](https://en.wikipedia.org/wiki/IPv4#Header).

As stated in the official spec released as the [RFC 6256](http://tools.ietf.org/html/rfc6256):

    An SDNV is simply a way of representing non-negative integers (bothpositive integers of arbitrary magnitude and 0)
    without expending much unnecessary space.

SDNVs closely resemble certain constructs with [ASN.1](http://en.wikipedia.org/wiki/Abstract_Syntax_Notation_One) but 
they are focused exclusively on numeric strings or bistrings unlike the latter which was developed for encoding more 
complex data structures.

### How do they work? ###

An SDNV is a numeric value encoded in N octets, the last of which has its most significant bit (MSB) set to `0`; the 
MSB of every other octet in the SDNV must be set to `1`.  The value encoded in an SDNV is the unsigned binary number 
obtained by concatenating into a single bit string the 7 least significant bits of each octet of the SDNV.

The following examples illustrate the encoding scheme for various hexadecimal values:

    0xABC  : 1010 1011 1100
             is encoded as
             {1 00 10101} {0 0111100}
             = 10010101 00111100
             
    0x1234 : 0001 0010 0011 0100
           =    1 0010 0011 0100
             is encoded as
             {1 0 100100} {0 0110100}
             = 10100100 00110100
             
    0x4234 : 0100 0010 0011 0100
           =  100 0010 0011 0100
             is encoded as
             {1 000000 1} {1 0000100} {0 0110100}
             = 10000001 10000100 00110100
             
    0x7F   : 0111 1111
           =  111 1111
             is encoded as
             {0 1111111}
             = 01111111

### How to use this module? ###

### Any issue or enhancement? ###

You know the [drill](https://github.com/ruiquelhas/sdnv/issues/new). However, you should also know that [Pull Requests](https://github.com/ruiquelhas/sdnv/pulls) are great!
