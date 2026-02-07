import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DataImporterProps {
    onImport: (data: any[]) => Promise<void>;
    templateUrl?: string;
    requiredColumns: string[];
}

const DataImporter: React.FC<DataImporterProps> = ({ onImport, requiredColumns }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setError(null);
        setSuccess(null);

        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws);

                if (jsonData.length === 0) {
                    setError('File is empty');
                    return;
                }

                // Validate columns
                const headers = Object.keys(jsonData[0] as object);
                const missingColumns = requiredColumns.filter(col =>
                    !headers.some(h => h.toLowerCase() === col.toLowerCase())
                );

                if (missingColumns.length > 0) {
                    setError(`Missing columns: ${missingColumns.join(', ')}`);
                    return;
                }

                setData(jsonData);
            } catch (err) {
                setError('Error parsing file. Please ensure it is a valid CSV or Excel file.');
                console.error(err);
            }
        };

        reader.readAsBinaryString(file);
    };

    const handleImport = async () => {
        if (data.length === 0) return;

        setLoading(true);
        setError(null);
        try {
            await onImport(data);
            setSuccess(`Successfully imported ${data.length} records!`);
            setData([]);
            setFileName('');
            // Optional: Clear file input
        } catch (err: any) {
            setError(err.message || 'Failed to import data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card className="border-dashed border-2">
                <CardContent className="pt-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <FileUp className="h-8 w-8 text-muted-foreground" />
                        <Label htmlFor="file-upload" className="cursor-pointer text-sm font-medium hover:underline">
                            {fileName || "Click to upload CSV or Excel file"}
                        </Label>
                        <Input
                            id="file-upload"
                            type="file"
                            accept=".csv, .xlsx, .xls"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <p className="text-xs text-muted-foreground">
                            Required columns: {requiredColumns.join(', ')}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert className="text-green-600 border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {data.length > 0 && (
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Preview ({data.length} records)</h3>
                        <Button onClick={handleImport} disabled={loading}>
                            {loading ? 'Importing...' : 'Confirm Import'}
                        </Button>
                    </div>
                    <div className="max-h-60 overflow-auto border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {Object.keys(data[0]).map((key) => (
                                        <TableHead key={key} className="whitespace-nowrap">{key}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.slice(0, 5).map((row, i) => (
                                    <TableRow key={i}>
                                        {Object.values(row).map((val: any, j) => (
                                            <TableCell key={j} className="whitespace-nowrap">{val}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                                {data.length > 5 && (
                                    <TableRow>
                                        <TableCell colSpan={Object.keys(data[0]).length} className="text-center text-muted-foreground">
                                            ... and {data.length - 5} more
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataImporter;
