def permutate(string):
    return permutate2("", string)


def permutate2(s1, s2):
    result = set([])
    n = len(s2)
    if n == 0:
        result.add(s1)
        return result
    else:
        for i in range(n):
            result.update(permutate2(s1 + s2[i], s2[0:i] + s2[i+1:]))
    return result


print(permutate('abc'))
