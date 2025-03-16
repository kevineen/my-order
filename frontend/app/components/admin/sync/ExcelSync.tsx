/**
 * Excel連携コンポーネント
 */
export function ExcelSync() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Excelテンプレート</h2>
        <div className="space-y-4">
          <button className="btn-secondary">
            発注テンプレートダウンロード
          </button>
          <button className="btn-secondary">
            在庫テンプレートダウンロード
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">データ取込</h2>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 p-6 text-center">
            <input type="file" className="hidden" accept=".xlsx,.xls" />
            <p>Excelファイルをドラッグ＆ドロップ</p>
            <p className="text-sm text-gray-500">または</p>
            <button className="btn-primary mt-2">ファイルを選択</button>
          </div>
        </div>
      </div>
    </div>
  );
}
