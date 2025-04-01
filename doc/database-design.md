# 打工人健身 APP 数据库设计

## 数据库概述

本文档详细描述「打工人健身」APP 的 uniCloud 数据库设计，包括各个集合（表）的结构、字段说明、索引设计以及集合间的关系。

## 集合设计

### 1. 动作集合 (exercises)

```json
{
  "bsonType": "object",
  "required": ["name", "category", "difficulty", "target_muscles"],
  "properties": {
    "_id": {
      "description": "动作ID，系统自动生成"
    },
    "name": {
      "bsonType": "string",
      "description": "动作名称"
    },
    "description": {
      "bsonType": "string",
      "description": "动作描述"
    },
    "category": {
      "bsonType": "string",
      "description": "动作分类：力量训练、有氧训练、柔韧性训练等"
    },
    "sub_category": {
      "bsonType": "string",
      "description": "动作子分类：胸部、背部、腿部等"
    },
    "difficulty": {
      "bsonType": "int",
      "description": "难度等级：1-简单，2-中等，3-困难",
      "minimum": 1,
      "maximum": 3
    },
    "target_muscles": {
      "bsonType": "array",
      "description": "目标肌肉群",
      "items": {
        "bsonType": "string"
      }
    },
    "equipment": {
      "bsonType": "array",
      "description": "所需器材",
      "items": {
        "bsonType": "string"
      }
    },
    "steps": {
      "bsonType": "array",
      "description": "动作步骤",
      "items": {
        "bsonType": "object",
        "properties": {
          "step_number": {
            "bsonType": "int",
            "description": "步骤序号"
          },
          "description": {
            "bsonType": "string",
            "description": "步骤描述"
          },
          "image_url": {
            "bsonType": "string",
            "description": "步骤图片URL"
          }
        }
      }
    },
    "video_url": {
      "bsonType": "string",
      "description": "教学视频URL"
    },
    "tips": {
      "bsonType": "array",
      "description": "动作提示",
      "items": {
        "bsonType": "string"
      }
    },
    "calories_per_min": {
      "bsonType": "double",
      "description": "每分钟消耗卡路里(估计值)"
    },
    "create_date": {
      "bsonType": "timestamp",
      "description": "创建时间"
    },
    "update_date": {
      "bsonType": "timestamp",
      "description": "更新时间"
    }
  }
}
```

### 2. 用户评估集合 (user_assessments)

```json
{
  "bsonType": "object",
  "required": ["user_id", "assessment_date"],
  "properties": {
    "_id": {
      "description": "评估ID，系统自动生成"
    },
    "user_id": {
      "bsonType": "string",
      "description": "用户ID"
    },
    "assessment_date": {
      "bsonType": "timestamp",
      "description": "评估日期"
    },
    "height": {
      "bsonType": "double",
      "description": "身高(cm)"
    },
    "weight": {
      "bsonType": "double",
      "description": "体重(kg)"
    },
    "bmi": {
      "bsonType": "double",
      "description": "BMI指数"
    },
    "push_up_count": {
      "bsonType": "int",
      "description": "俯卧撑数量"
    },
    "sit_up_count": {
      "bsonType": "int",
      "description": "仰卧起坐数量"
    },
    "plank_time": {
      "bsonType": "int",
      "description": "平板支撑时间(秒)"
    },
    "squat_count": {
      "bsonType": "int",
      "description": "深蹲数量"
    },
    "flexibility_level": {
      "bsonType": "int",
      "description": "柔韧性水平：1-低，2-中，3-高",
      "minimum": 1,
      "maximum": 3
    },
    "endurance_level": {
      "bsonType": "int",
      "description": "耐力水平：1-低，2-中，3-高",
      "minimum": 1,
      "maximum": 3
    },
    "strength_level": {
      "bsonType": "int",
      "description": "力量水平：1-低，2-中，3-高",
      "minimum": 1,
      "maximum": 3
    },
    "overall_level": {
      "bsonType": "int",
      "description": "综合水平：1-初级，2-中级，3-高级",
      "minimum": 1,
      "maximum": 3
    },
    "notes": {
      "bsonType": "string",
      "description": "评估备注"
    }
  }
}
```

### 3. 训练计划集合 (training_plans)

```json
{
  "bsonType": "object",
  "required": ["user_id", "name", "exercises"],
  "properties": {
    "_id": {
      "description": "计划ID，系统自动生成"
    },
    "user_id": {
      "bsonType": "string",
      "description": "用户ID"
    },
    "name": {
      "bsonType": "string",
      "description": "计划名称"
    },
    "description": {
      "bsonType": "string",
      "description": "计划描述"
    },
    "level": {
      "bsonType": "int",
      "description": "计划难度：1-初级，2-中级，3-高级",
      "minimum": 1,
      "maximum": 3
    },
    "duration_weeks": {
      "bsonType": "int",
      "description": "计划持续周数"
    },
    "goal": {
      "bsonType": "string",
      "description": "训练目标：增肌、减脂、塑形等"
    },
    "exercises": {
      "bsonType": "array",
      "description": "训练动作列表",
      "items": {
        "bsonType": "object",
        "properties": {
          "exercise_id": {
            "bsonType": "string",
            "description": "动作ID"
          },
          "day_of_week": {
            "bsonType": "int",
            "description": "星期几：1-7",
            "minimum": 1,
            "maximum": 7
          },
          "sets": {
            "bsonType": "int",
            "description": "组数"
          },
          "reps": {
            "bsonType": "int",
            "description": "每组重复次数"
          },
          "duration": {
            "bsonType": "int",
            "description": "持续时间(秒)"
          },
          "rest_time": {
            "bsonType": "int",
            "description": "休息时间(秒)"
          },
          "order": {
            "bsonType": "int",
            "description": "顺序"
          }
        }
      }
    },
    "is_system": {
      "bsonType": "bool",
      "description": "是否系统预设计划"
    },
    "is_active": {
      "bsonType": "bool",
      "description": "是否激活"
    },
    "create_date": {
      "bsonType": "timestamp",
      "description": "创建时间"
    },
    "update_date": {
      "bsonType": "timestamp",
      "description": "更新时间"
    }
  }
}
```

### 4. 训练记录集合 (workout_records)

```json
{
  "bsonType": "object",
  "required": ["user_id", "start_time"],
  "properties": {
    "_id": {
      "description": "记录ID，系统自动生成"
    },
    "user_id": {
      "bsonType": "string",
      "description": "用户ID"
    },
    "plan_id": {
      "bsonType": "string",
      "description": "训练计划ID，可为空表示自由训练"
    },
    "start_time": {
      "bsonType": "timestamp",
      "description": "开始时间"
    },
    "end_time": {
      "bsonType": "timestamp",
      "description": "结束时间"
    },
    "duration": {
      "bsonType": "int",
      "description": "训练时长(秒)"
    },
    "calories_burned": {
      "bsonType": "double",
      "description": "消耗卡路里"
    },
    "exercise_records": {
      "bsonType": "array",
      "description": "动作记录",
      "items": {
        "bsonType": "object",
        "properties": {
          "exercise_id": {
            "bsonType": "string",
            "description": "动作ID"
          },
          "sets": {
            "bsonType": "array",
            "description": "组记录",
            "items": {
              "bsonType": "object",
              "properties": {
                "reps": {
                  "bsonType": "int",
                  "description": "重复次数"
                },
                "weight": {
                  "bsonType": "double",
                  "description": "重量(kg)"
                },
                "duration": {
                  "bsonType": "int",
                  "description": "持续时间(秒)"
                },
                "completed": {
                  "bsonType": "bool",
                  "description": "是否完成"
                }
              }
            }
          },
          "notes": {
            "bsonType": "string",
            "description": "备注"
          }
        }
      }
    },
    "feeling": {
      "bsonType": "int",
      "description": "感受评分：1-5",
      "minimum": 1,
      "maximum": 5
    },
    "notes": {
      "bsonType": "string",
      "description": "训练备注"
    }
  }
}
```

### 5. 用户收藏集合 (user_favorites)

```json
{
  "bsonType": "object",
  "required": ["user_id", "exercise_id"],
  "properties": {
    "_id": {
      "description": "收藏ID，系统自动生成"
    },
    "user_id": {
      "bsonType": "string",
      "description": "用户ID"
    },
    "exercise_id": {
      "bsonType": "string",
      "description": "动作ID"
    },
    "create_date": {
      "bsonType": "timestamp",
      "description": "收藏时间"
    }
  }
}
```

### 6. 用户成就集合 (user_achievements)

```json
{
  "bsonType": "object",
  "required": ["user_id", "achievement_id", "unlock_date"],
  "properties": {
    "_id": {
      "description": "记录ID，系统自动生成"
    },
    "user_id": {
      "bsonType": "string",
      "description": "用户ID"
    },
    "achievement_id": {
      "bsonType": "string",
      "description": "成就ID"
    },
    "unlock_date": {
      "bsonType": "timestamp",
      "description": "解锁时间"
    }
  }
}
```

### 7. 成就集合 (achievements)

```json
{
  "bsonType": "object",
  "required": ["name", "description", "condition"],
  "properties": {
    "_id": {
      "description": "成就ID，系统自动生成"
    },
    "name": {
      "bsonType": "string",
      "description": "成就名称"
    },
    "description": {
      "bsonType": "string",
      "description": "成就描述"
    },
    "icon_url": {
      "bsonType": "string",
      "description": "成就图标URL"
    },
    "category": {
      "bsonType": "string",
      "description": "成就分类"
    },
    "condition": {
      "bsonType": "object",
      "description": "解锁条件",
      "properties": {
        "type": {
          "bsonType": "string",
          "description": "条件类型：workout_count, exercise_count等"
        },
        "value": {
          "bsonType": "int",
          "description": "条件值"
        },
        "exercise_id": {
          "bsonType": "string",
          "description": "特定动作ID，可选"
        }
      }
    },
    "points": {
      "bsonType": "int",
      "description": "成就点数"
    },
    "is_hidden": {
      "bsonType": "bool",
      "description": "是否隐藏成就"
    }
  }
}
```

## 索引设计

### 1. 用户集合 (uni-id-users)

- 主键索引：`_id`
- 唯一索引：`username`

### 2. 用户信息集合 (user_profiles)

- 主键索引：`_id`
- 唯一索引：`user_id`
- 普通索引：`fitness_level`

### 3. 动作集合 (exercises)

- 主键索引：`_id`
- 复合索引：`{category: 1, difficulty: 1}`
- 复合索引：`{target_muscles: 1, difficulty: 1}`

### 4. 用户评估集合 (user_assessments)

- 主键索引：`_id`
- 复合索引：`{user_id: 1, assessment_date: -1}`

### 5. 训练计划集合 (training_plans)

- 主键索引：`_id`
- 复合索引：`{user_id: 1, is_active: 1}`
- 复合索引：`{level: 1, goal: 1, is_system: 1}`

### 6. 训练记录集合 (workout_records)

- 主键索引：`_id`
- 复合索引：`{user_id: 1, start_time: -1}`

### 7. 用户收藏集合 (user_favorites)

- 主键索引：`_id`
- 唯一索引：`{user_id: 1, exercise_id: 1}`

### 8. 用户成就集合 (user_achievements)

- 主键索引：`_id`
- 唯一索引：`{user_id: 1, achievement_id: 1}`

## 集合关系

1. **用户与用户信息**：一对一关系，一个用户对应一条用户信息记录
2. **用户与评估**：一对多关系，一个用户可以有多次评估记录
3. **用户与训练计划**：一对多关系，一个用户可以创建多个训练计划
4. **用户与训练记录**：一对多关系，一个用户可以有多条训练记录
5. **训练计划与训练记录**：一对多关系，一个训练计划可以对应多条训练记录
6. **动作与训练计划**：多对多关系，通过训练计划中的exercises数组实现
7. **动作与训练记录**：多对多关系，通过训练记录中的exercise_records数组实现
8. **用户与收藏动作**：多对多关系，通过用户收藏集合实现
9. **用户与成就**：多对多关系，通过用户成就集合实现

## 数据库权限设计

### 公共权限

- **exercises集合**：所有用户可读，仅管理员可写
- **achievements集合**：所有用户可读，仅管理员可写

### 用户权限

- **uni-id-users集合**：用户只能读写自己的数据
- **user_profiles集合**：用户只能读写自己的数据
- **user_assessments集合**：用户只能读写自己的数据
- **training_plans集合**：用户只能读写自己的数据，系统预设计划所有用户可读
- **workout_records集合**：用户只能读写自己的数据
- **user_favorites集合**：用户只能读写自己的数据
- **user_achievements集合**：用户只能读自己的数据，系统自动写入

## 数据迁移与备份策略

1. **定期备份**：每日自动备份全部数据
2. **增量备份**：每小时进行增量备份
3. **数据迁移**：版本更新时提供数据迁移脚本

## 数据安全策略

1. **敏感数据加密**：用户密码等敏感信息使用加密存储
2. **访问控制**：严格的集合访问权限控制
3. **数据验证**：使用schema验证确保数据完整性
4. **操作日志**：记录关键数据操作日志