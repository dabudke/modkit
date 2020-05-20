#!/bin/sh

rm -f ./token.json
echo "{" >> token.json
echo "    \"token\": \"bot token\"," >> token.json
echo "    \"testingToken\": \"testing bot token\"" >> token.json
echo "}" >> token.json