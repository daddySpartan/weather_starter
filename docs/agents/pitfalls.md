# Common Pitfalls

- Coordinate validation is Singapore-only for location creation; preserve bounds checks unless requirements change.
- Some weather fields can be missing when upstream endpoints partially fail; do not assume every field is always present.
- Root npm test can fail on Windows due to POSIX env assignment in script definitions.
