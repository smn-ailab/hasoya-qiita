# -*- coding: utf-8 -*-
r"""日本語文章をMeCab + Neologdで分解してPandasのDataFrameに入れて返すツール.

利用する環境に既にMeCabとそれのPython UIであるmecab-python3がInstallされていることが必須.
やり方はこのブログ記事を参考にすると良い: https://qiita.com/grachro/items/4fbc9bf8174c5abb7bdd

DataFrameのフォーマットは以下の形式
表層形\t品詞,品詞細分類1,品詞細分類2,品詞細分類3,活用型,活用形,原形,読み,発音

カラム名はこれらを順に英訳した
surface_form, word_class, class_detail1, class_detail2, class_detail3, conjugational_type,
conjugational_form, original_form, katakana, pronunciation
とする.
"""

import subprocess
import sys
from typing import List, Optional

import MeCab
import pandas as pd


class MeCabParser:
    """MeCab + Neologdで日本語を分解してDataFrameに入れるクラス."""

    mecab_column = ["surface_form", "word_class", "class_detail1",
                    "class_detail2", "class_detail3", "conjugational_type",
                    "conjugational_form", "original_form", "katakana", "pronunciation"]

    def __init__(self) -> None:
        """Neologdが存在するディレクトリを探し、MeCabのParserを定義する."""
        neolog_dir = subprocess.getoutput("echo `mecab-config --dicdir`\"/mecab-ipadic-neologd\"")
        self.mecab = MeCab.Tagger("-d {}".format(neolog_dir))

    def parse(self, target: str) -> pd.DataFrame:
        """MeCabを利用して日本語文字列を品詞分解し、リストにして返す.

        返り値のカラム名は以下の通り.

        surface_form, word_class, class_detail1, class_detail2, class_detail3, conjugational_type,
        conjugational_form, original_form, katakana, pronunciation

        :param target: 品詞分解対象の文字列
        :return: 行が分解された単語、カラムが単語の性質にあたる要素になっているDataFrame
        """
        formatted: List[List[Optional[str]]] = []
        parse_result = self.mecab.parse(target)
        for line in parse_result.split("\n"):
            if line and line != "EOS":
                word, properties = line.split("\t")[0:2]
                property_list = properties.split(",")

                property_list = [p if p != "*" else None for p in property_list]

                formatted.append([word] + property_list)

        return pd.DataFrame(formatted, columns=self.mecab_column)


def main(args: List[str]) -> None:
    """おためし用."""
    if len(args) == 2:
        parser = MeCabParser()
        print(parser.parse(args[1]))
    else:
        raise ValueError('Usage: python mecab-pandas.py "スパッタリー最強"')


if __name__ == "__main__":
    main(sys.argv)
