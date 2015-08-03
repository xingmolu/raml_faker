# raml_faker
使用raml_parse来解析raml，使用faker.js来模拟数据


## 使用



## JSON－schema
```javascript
{
    "$schema": "http://json-schema.org/schema",
    "type": "object",
    "description": "A collection of objects",
    "properties": {
        "persons": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "name",
                        "value": "findName"
                    },
                    "province": {
                        "type": "address",
                        "value": "province"
                    },

                    "abbr": {
                        "type": "address",
                        "value": "streetAddress"
                    },

                    "city": {
                        "type": "address",
                        "value": "city"
                    },

                    "street": {
                        "type": "address",
                        "value": "streetName"
                    },

                    "phoneNumber": {
                        "type": "PhoneNumber",
                        "value": "phoneNumber"
                    },

                    "company": {
                        "type": "company",
                        "value": "companyName"
                    },

                    "info": {
                        "type": "string",
                        "maxLength": "20"
                    }
                },
                "required": ["name", "city", "province", "phoneNumber"]
            }
        }
    },
    "required": ["arrayOfObjects"],
    "definitions": {
        "other": {
            "type": "number"
        }
    }
}
```