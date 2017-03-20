# test-secret-handshake

Test vectors [secret-handshake](https://github.com/auditdrivencrypto/secret-handshake).

These test vectors are generated from the basic test suite from the refrence implementation.
This does not cover the logic of the protocol, but makes it easy to verify that the packets
are all parsed correctly.

## format

The output is a JSON array, of objects with `{name, args, result}`
all binary values are stored as hex encoded strings.
name is the name of an operation. _create_ operations take a `state` argument and return a packet.
_verify_ operations take a `state`, an encrypted `packet` and return a new `state`
(or null, if the packet was not valid given the state)

## License

MIT
