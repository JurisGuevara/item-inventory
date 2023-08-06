<template>
  <q-layout>
    <Header />
    <q-page-container class="q-ma-xl">
      <div class="page-title">Add Set</div>
      <q-form
        @submit="submitSet"
        class="q-gutter-md"
      >

        <q-select
          dense
          filled
          v-model="setDeptCode"
          use-input
          input-debounce="900"
          label="SELECT DEPARTMENT"
          hint="Required"
          :options="deptOptions"
          @filter="filterDept"
          emit-value
          map-options
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Select a department']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          dense
          filled
          v-model="setCategoryCode"
          use-input
          input-debounce="900"
          label="SELECT CATEGORY"
          hint="Required"
          :options="catOptions"
          @filter="filterCat"
          emit-value
          map-options
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Select a category']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-input
          dense
          filled
          v-model.trim="itemCode"
          label="ITEM CODE"
          maxlength="6"
          counter
          hint="max 6 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="receivingReport"
          label="RR NUMBER"
          maxlength="10"
          counter
          hint="max 10 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="setGenericName"
          label="SET GENERIC NAME"
          hint="Required max 255 characters"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Type item name']"
          maxlength="255"
          counter
        />

        <!--
          hint="Required"
          lazy-rules
          :rules="[ val => val && val >= 1.00 || 'Enter an amount']"

          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
        -->
        <q-input
          dense
          filled
          v-model="setCost"
          label="SET COST (php)"
          prefix="₱"
          type="number"
          input-class="text-right"
          style="max-width: 200px"
          step="0.01"
          min="0"
          :rules="[ val => val && val >= 0 || 'Minimum of 0']"
        />

        <q-input
          dense
          filled
          v-model="setDateReceived"
          label="Date Received"
          type="date"
          style="max-width: 200px"
        />

        <q-input
          dense
          filled
          v-model.trim="setSupplierName"
          label="Supplier name (Set)"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="setPurchaseOrderNo"
          label="PO number (Set)"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="setInvoiceNo"
          label="Invoice number (Set)"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="setItemSpecs"
          label="Specification (Set)"
          maxlength="1000"
          counter
          hint="max 1000 characters"
        />

        <q-input
          dense
          filled
          v-model.trim="setRemarks"
          label="Remarks (Set)"
          maxlength="255"
          counter
          hint="max 255 characters"
        />

        <div class="page-title">Items</div>

        <div v-if="items">
          <div v-for="(item, index) in items" :key="index">
            <!-- beginning of card -->
            <div class="item-card bg-primary">
              <div class="item-card-content q-ma-xs bg-white q-gutter-md">

                <div class="row items-start justify-between">
                  <q-input
                    dense
                    style="max-width: 70%; width: 100%;"
                    filled
                    v-model.trim="item.genericName"
                    label="GENERIC NAME"
                    hint="Required max 255 characters"
                    lazy-rules
                    :rules="[ val => val && val[index].length > 0 || 'Type item name']"
                  />
                  <q-btn color="negative" @click="removeItem(index)">Remove Item</q-btn>
                </div>

                <!-- mask="#.##"
                fill-mask="0"
                reverse-fill-mask -->
                <q-input
                  dense
                  filled
                  v-model="item.unitCost"
                  label="UNIT COST (php)"
                  prefix="₱"
                  type="number"
                  input-class="text-right"
                  style="max-width: 200px"
                  step="0.01"
                  min="0"
                  :rules="[ val => val && val >= 0 || 'Minimum of 0']"
                />

                <q-input
                  dense
                  filled
                  v-model.trim="item.brandName"
                  label="Brand"
                  maxlength="255"
                  counter
                  hint="max 255 characters"
                />

                <q-input
                  dense
                  filled
                  v-model.trim="item.brandModel"
                  label="Model"
                  maxlength="255"
                  counter
                  hint="max 255 characters"
                />

                <q-input
                  dense
                  filled
                  v-model.trim="item.serialNo"
                  label="Serial number"
                  maxlength="255"
                  counter
                  hint="max 255 characters"
                />

                <q-input
                  dense
                  filled
                  v-model.trim="item.itemSpecs"
                  label="Specification (Item)"
                  maxlength="1000"
                  counter
                  hint="max 1000 characters"
                />

                <q-input
                  dense
                  filled
                  v-model.trim="item.newAssetCode"
                  label="New Asset Code"
                  maxlength="255"
                  counter
                  hint="max 255 characters"
                />

                <div class="q-gutter-sm flex items-center ats-checkbox">
                  <q-checkbox
                    v-model="item.tagStatus"
                    color="primary"
                    label="Asset Tag Status: "
                    true-value="Tagged"
                    false-value="Untagged"
                    style="margin: 0;"
                  />
                  <strong style="padding-bottom: 7px;">'{{ item.tagStatus }}'</strong>
                </div>

                <q-input
                  dense
                  filled
                  v-model.trim="item.itemRemarks"
                  label="Remarks (Set)"
                  maxlength="255"
                  counter
                  hint="max 255 characters"
                />

                <q-input
                  dense
                  filled
                  v-model.trim="item.oldAssetCode"
                  label="Old asset code"
                  maxlength="255"
                  counter
                  hint="max 255 characters"
                />

                <q-input
                  dense
                  filled
                  v-model="item.physicalLocation"
                  label="Physical location"
                  maxlength="255"
                  counter
                  hint="max 255 characters"
                />

              </div>
            </div>
            <!-- end of card -->
          </div>
        </div>

        <div class="row justify-end">
          <q-btn label="Add Item" color="positive" @click="addItem"/>
        </div>

        <div class="row justify-center">
          <q-btn :loading="loading" label="Add Set to Inventory" type="submit" color="primary" style="width: 40%;"/>
        </div>

      </q-form>

      <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
        <q-btn fab icon="keyboard_arrow_up" color="blue-grey-12" />
      </q-page-scroller>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import axios from 'axios';
import Header from '../components/Header.vue';
import setToken from 'src/helpers/setToken';

export default defineComponent ({
  components: {
    Header,
  },
  data() {
    return {
      loading: false,
      url: `${process.env.API_HOST}/api/addset`,
      deptUrl: `${process.env.API_HOST}/api/getDept`,
      categoryUrl: `${process.env.API_HOST}/api/getCategory`,

      token: setToken().token,
      user: setToken().user,
      rights: setToken().rights,

      deptList: null,
      deptOptions: this.deptList,

      catList: null,
      catOptions: this.catList,

      setDeptCode: null,
      setCategoryCode: null,

      items: [],

      // set inputs
      setGenericName: '',
      setCost: '0',
      setDateReceived: '',
      setSupplierName: '',
      setPurchaseOrderNo: '',
      setInvoiceNo: '',
      setItemSpecs: '',
      setRemarks: '',
      itemCode: '',
      receivingReport: '',

      // item inputs
      genericName: '',
      unitCost: '0',
      brandName: '',
      brandModel: '',
      serialNo: '',
      itemSpecs: '',
      newAssetCode: '',
      tagStatus: 'Untagged',
      itemRemarks: '',
      oldAssetCode: '',
      physicalLocation: '',
    }
  },
  computed: {
    ...mapState([
      'departments',
      'categories',
    ]),
  },
  methods: {
    warning(text, color) {
      this.$q.notify(
        {
          color: color,
          textColor: 'white',
          icon: 'warning',
          message: text,
        }
      );
    },
    filterDept (val, update) {
      if (val === '') {
        update(() => {
          this.deptOptions = this.deptList
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.deptOptions = this.deptList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterCat (val, update) {
      if (val === '') {
        update(() => {
          this.catOptions = this.catList
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.catOptions = this.catList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    addItem() {
      let newItem = {
        genericName: '',
        unitCost: '0',
        brandName: '',
        brandModel: '',
        serialNo: '',
        itemSpecs: '',
        newAssetCode: '',
        tagStatus: 'Untagged',
        itemRemarks: '',
        oldAssetCode: '',
        physicalLocation: '',
      }
      this.items.push(newItem);
    },
    removeItem(index) {
      this.items.splice(index, 1);
    },
    submitSet: async function() {
      /**
       * validation / submitting a set requires a minimum of 2 items (temporarily disabled)
       */
      // if (this.items.length < 2) {
      //   this.warning('Minimum of 2 items required', 'red-5');
      //   return;
      // }

      let cTotal = 0;
      this.items.forEach(element => {
        cTotal += +element.unitCost;
      });

      if (cTotal > this.setCost) {
        this.warning('Total cost of items must not exceed the set cost', 'red-5');
        return;
      }

      this.loading = true;
      const addSetUrl = this.url;
      const token = this.token;

      const setData = {
        // set inputs
        setDeptCode: this.setDeptCode,
        setCategoryCode: this.setCategoryCode,
        setGenericName: this.setGenericName,
        setCost: this.setCost,
        setDateReceived: this.setDateReceived,
        setSupplierName: this.setSupplierName,
        setPurchaseOrderNo: this.setPurchaseOrderNo,
        setInvoiceNo: this.setInvoiceNo,
        setItemSpecs: this.setItemSpecs,
        setRemarks: this.setRemarks,
        itemCode: this.itemCode,
        receivingReport: this.receivingReport,
      }

      const itemData = () => {
        const xItems = this.items;
        const yItems = [];

        xItems.forEach(item => {
          if (item.tagStatus == 'Tagged') {
            item.tagStatus = '1';
          } else if (item.tagStatus == 'Untagged') {
            item.tagStatus = '0';
          }

          const zItems = {
            genericName: item.genericName,
            unitCost: item.unitCost,
            brandName: item.brandName,
            brandModel: item.brandModel,
            serialNo: item.serialNo,
            itemSpecs: item.itemSpecs,
            newAssetCode: item.newAssetCode,
            assetTagStatus: item.tagStatus,
            itemRemarks: item.itemRemarks,
            oldAssetCode: item.oldAssetCode,
            physicalLocation: item.physicalLocation,
          }

          // remove empty string fields
          const aItems = Object.fromEntries(Object.entries(zItems).filter(([_, v]) => v !== ''));
          yItems.push(aItems);
        });

        return yItems;
      }

      // remove empty string fields
      let postSet = Object.fromEntries(Object.entries(setData).filter(([_, v]) => v !== ''));
      let postItems = itemData();

      await axios.post(`${addSetUrl}`, { postSet, postItems }, { headers: {"Authorization" : `Bearer ${token}`} })
      .then(res => {
        if(res.status === 200) {
          this.warning('Item Added', 'green-5');
        } else {
          this.warning('Failed to add items', 'red-5');
        }
      })
      .catch(err => {
        if(err.message === 'Network Error') {
          this.warning('Network Error', 'red-5');
        } else {
          this.warning('Error', 'red-5');
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 900);
      })
    },
  },
  mounted() {
    this.deptList = this.departments;
    this.catList = this.categories;
  },
  watch: {
    departments: function(value) {
      this.deptList = value;
    },
    categories: function(value) {
      this.catList = value;
    },
  }
})
</script>

<style scoped>
  .item-card {
    border-radius: 6px;
    padding: 20px 10px 10px;
    margin-bottom: 20px;
  }
  .item-card-content {
    border-radius: 3px;
    padding: 10px;
  }
</style>
