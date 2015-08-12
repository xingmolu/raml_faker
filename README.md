# raml_faker
使用raml_parse来解析raml，使用faker.js来模拟数据

## mock API

* image 
    * imageUrl 模拟一个图形  {width: number, height: number} 返回相应宽高的图片

* name
    * findName 返回一个姓名 
    * firstName 返回一个姓
    * lastName 返回一个名

* address
    * province 返回一个省名称
    * streetAddress 返回一个街道地址
    * city 返回一个城市
    * streetName 返回一个街道名

* PhoneNumber
    * phoneNumber 返回一个手机号码

* company
    * companyName 返回一个公司名称

* string 
    * {maxLength: number, minLength: number} 返回相应长度限制的随机字符串

* random 
    * number {minimum: number, maximum: number} 返回一个随机的数字
    * boolean 返回一个boolean值
    * date 返回一个日期（14位毫米格式）
    * color 返回一个随机的颜色



### 示例
```javascript
"background": {
    "type": "random",
    "value": "color"
}

// "background": 将返回一个色值

```
如果对象中包含 `key` 为 `actual` 时，将直接返回其value的值。

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