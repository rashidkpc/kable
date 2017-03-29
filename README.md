# kable

## Pro tips:

You need to turn on regexs in Painless if you want any of the field extraction stuff

```
./bin/elasticsearch -Escript.painless.regex.enabled=true
```

Also, you need to extract from the `.keyword` version of fields if you're using the defauld elasticsearch mapping as `.exsplit()` and `.exregex()` use `doc[]` and you can't access `doc[]` for analyzed fields.
